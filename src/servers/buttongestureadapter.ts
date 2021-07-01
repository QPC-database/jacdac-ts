import {
    ButtonEvent,
    ButtonGestureEvent,
    CONNECT,
    DEVICE_CHANGE,
    DEVICE_CONNECT,
    EVENT,
    ROLE_BOUND,
    SELF_ANNOUNCE,
    SRV_BUTTON,
    SRV_BUTTON_GESTURE,
} from "../jdom/constants"
import SensorServer from "./sensorserver"
import { assert, JDDevice, JDEvent, JDService } from "../jdom/jacdac-jdom"
import RoleManager from "./rolemanager"
import JDServiceServer from "../jdom/serviceserver"

export class AdapterServer extends JDServiceServer {
    private roleManager? : RoleManager = undefined
    
    // This is a nasty hack that allows the role manager to be set after the server is instantiated.
    // The right solution would be to have this listen for role broadcasts for something
    // but that's not a now feature.
    // TODO de-jankify
    public _hack_setRoleManager(roleManager: RoleManager) {
        assert(this.roleManager === undefined, "resetting role manager")

        this.roleManager = roleManager
        this.onRoleManager(roleManager)
    }

    // to be overloaded - code to run once a role manager is available
    protected onRoleManager(roleManager: RoleManager) { }
}

export default class ButtonGestureAdapter extends AdapterServer {
    protected ready = false  // whether it is bound to the source service
    protected state: "up" | "down_click" | "up_click" | "down_held" = "up"

    // TODO this is only used to gate timeouts using threading + wait.
    // A better solution would be to terminate threads so they don't fire when they're obsoleted.
    // TODO if keeping this architecture, perhaps this needs to be more specific, eg clickTimeoutCounter
    protected eventCounter = 0

    // counter to detect double-clicks and the like
    // reset upon a event being generated
    protected clickCounter = 0

    protected readonly buttonRole: string

    constructor(buttonRole: string, instanceName?: string, 
        protected clickTimeoutMs = 200, protected multiClickTimeoutMs = 200) {
        // TODO should this take not a service so it can be instantiated before a button is announced on the bus?
        // (to avoid the async boilerplate nightmare)
        super(SRV_BUTTON_GESTURE, {
            instanceName,
        })

        this.buttonRole = buttonRole
    }

    protected onRoleManager(roleManager: RoleManager) {
        const service = roleManager.getService(this.buttonRole)
        assert(service.serviceClass == SRV_BUTTON)  // TODO can this logic be moved into infrastructure?

        service.on(EVENT, (evs: JDEvent[]) => {
            evs.forEach((ev) => {
                const now = this.device.bus.timestamp
                if (ev.code == ButtonEvent.Down) {
                    this.onSourceButtonDown()
                } else if (ev.code == ButtonEvent.Up) {
                    this.onSourceButtonUp()
                }
            })
        })
    }

    private onSourceButtonDown() {
        this.eventCounter += 1
        const thisEventCount = this.eventCounter
        this.state = "down_click"

        // TODO not use setTimeout, needs to use some bus-level timing / scheduler instead!
        setTimeout( () => {
            if (this.eventCounter == thisEventCount) {
                if (this.clickCounter == 0) {
                    this.sendEvent(ButtonGestureEvent.ClickHold)
                } else {
                    this.sendEvent(ButtonGestureEvent.MultiClickHold)
                    // TODO pack number of clicks
                }

                this.state = "down_held"
            }
        }, this.clickTimeoutMs)
    }

    private onSourceButtonUp() {
        if (this.state == "down_click") {
            this.eventCounter += 1
            const thisEventCount = this.eventCounter
            this.clickCounter += 1
            this.state = "up_click"

            if (this.clickCounter == 1) {
                this.sendEvent(ButtonGestureEvent.Click)
            } else if (this.clickCounter == 2) {
                this.sendEvent(ButtonGestureEvent.DoubleClick)
            } else {
                this.sendEvent(ButtonGestureEvent.MultiClick)
                // TODO pack number of clicks
            }

            // TODO not use setTimeout, needs to use some bus-level timing / scheduler instead!
            setTimeout( () => {
                if (this.eventCounter == thisEventCount) {
                    this.state = "up"
                    this.clickCounter = 0
                }
            }, this.multiClickTimeoutMs)
        } else if (this.state == "down_held") {
            this.sendEvent(ButtonGestureEvent.HoldRelease)
            
            this.state = "up"
            this.clickCounter = 0
        }
    }
}