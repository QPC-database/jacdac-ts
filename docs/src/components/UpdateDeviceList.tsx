import { Button, Grid } from "@material-ui/core"
import { Alert } from "@material-ui/lab"
import React, { useContext, useEffect, useState } from "react"
import { DEVICE_ANNOUNCE, FIRMWARE_BLOBS_CHANGE } from "../../../src/jdom/constants"
import { JDDevice } from "../../../src/jdom/device"
import { scanFirmwares, FirmwareBlob, FirmwareInfo, flashFirmwareBlob, updateApplicable } from "../../../src/jdom/flashing"
import JACDACContext, { JDContextProps } from "../../../src/react/Context"
import useEventRaised from "../jacdac/useEventRaised"
import CircularProgressWithLabel from "./ui/CircularProgressWithLabel"
import DeviceCard from "./DeviceCard"
import useGridBreakpoints from "./useGridBreakpoints"
import { BusState } from "../../../src/jdom/bus"
import AppContext from "./AppContext"
import useChange from "../jacdac/useChange"
import useDevices from "./hooks/useDevices"

function UpdateDeviceCard(props: {
    device: JDDevice,
    firmware: FirmwareInfo,
    blob: FirmwareBlob,
}) {
    const { bus } = useContext<JDContextProps>(JACDACContext)
    const { device, firmware, blob } = props
    const { setError } = useContext(AppContext)
    const [progress, setProgress] = useState(0)
    const update = blob && firmware && updateApplicable(firmware, blob);
    const flashing = useChange(device, d => d.flashing);

    const handleFlashing = async () => {
        if (device.flashing) return;
        const safeBoot = bus.safeBoot;
        try {
            setProgress(0)
            device.flashing = true; // don't refresh registers while flashing
            bus.safeBoot = false; // don't poud messages while flashing
            const updateCandidates = [firmware]
            await flashFirmwareBlob(bus, blob, updateCandidates, prog => setProgress(prog))
        } catch (e) {
            setError(e);
        } finally {
            device.flashing = false;
            bus.safeBoot = safeBoot;
        }
    }

    return <DeviceCard device={device}
        showFirmware={true}
        content={update && <span>Update to {blob.version}</span>}
        // tslint:disable-next-line: react-this-binding-issue
        action={flashing ? <CircularProgressWithLabel value={progress} />
            : update
                ? <Button aria-label="deploy new firmware to device" disabled={flashing} variant="contained"
                    color="primary" onClick={handleFlashing}>Flash</Button>
                : <Alert severity="success">Up to date!</Alert>} />
}

export default function UpdateDeviceList() {
    const { bus, connectionState } = useContext<JDContextProps>(JACDACContext)
    const [scanning, setScanning] = useState(false)
    const gridBreakpoints = useGridBreakpoints()

    const devices = useDevices({ announced: true, ignoreSelf: true })
    const isFlashing = devices.some(dev => dev.flashing);
    const blobs = useEventRaised(FIRMWARE_BLOBS_CHANGE, bus, () => bus.firmwareBlobs)
    async function scan() {
        if (!blobs?.length || isFlashing
            || scanning || connectionState != BusState.Connected)
            return;
        console.log(`start scanning bus`)
        try {
            setScanning(true)
            await scanFirmwares(bus)
        }
        finally {
            setScanning(false)
        }
    }
    // load indexed db file once
    useEffect(() => { scan() }, [isFlashing, connectionState])
    useEffect(() => bus.subscribe(DEVICE_ANNOUNCE, () => scan()), [bus])
    const updates = devices.map(device => {
        return {
            firmware: device.firmwareInfo,
            device,
            blob: device.firmwareInfo && blobs?.find(b => device.firmwareInfo.firmwareIdentifier == b.firmwareIdentifier)
        }
    });

    return <Grid container spacing={2}>
        {updates
            .map(update => <Grid key={"fw" + update.device.id} item {...gridBreakpoints}>
                <UpdateDeviceCard {...update} />
            </Grid>)}
    </Grid>

}