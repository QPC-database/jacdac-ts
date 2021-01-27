import React, { useContext, useEffect, useMemo } from "react";
import { DashboardServiceProps } from "./DashboardServiceWidget";
import useWidgetSize from "../widgets/useWidgetSize";
import useServiceHost from "../hooks/useServiceHost";
import { SvgWidget } from "../widgets/SvgWidget";
import useWidgetTheme from "../widgets/useWidgetTheme";
import useChange from "../../jacdac/useChange";
import { useRegisterUnpackedValue } from "../../jacdac/useRegisterValue";
import useAnimationFrame from "../hooks/useAnimationFrame";
import JACDACContext, { JDContextProps } from "../../../../src/react/Context";
import { Grid, Slider } from "@material-ui/core";
import LEDServiceHost, { LedAnimation, LedAnimationStepsType } from "../../../../src/hosts/ledservicehost";
import { LedReg } from "../../../../src/jdom/constants";

export default function DashboardLED(props: DashboardServiceProps) {
    const { bus } = useContext<JDContextProps>(JACDACContext)
    const { service, services, variant } = props;
    const widgetSize = useWidgetSize(variant, services.length);
    const host = useServiceHost<LEDServiceHost>(service);
    const color = host ? "secondary" : "primary";
    const { active } = useWidgetTheme(color);
    const [maxIterations] = useRegisterUnpackedValue<[number]>(service.register(LedReg.MaxIterations));
    const brightnessRegister = service.register(LedReg.Brightness);
    const [brightness] = useRegisterUnpackedValue<[number]>(brightnessRegister);
    const [currentIteration] = useRegisterUnpackedValue<[number]>(service.register(LedReg.CurrentIteration));
    const [steps] = useRegisterUnpackedValue<LedAnimationStepsType>(service.register(LedReg.Steps));

    // restart animation with steps
    const animation = useMemo(() => new LedAnimation(maxIterations, brightness, currentIteration, steps)
        , steps || [])
    // update animation on the fly
    useEffect(() => {
        animation.maxIterations = maxIterations
        animation.brightness = brightness
        animation.currentIteration = currentIteration
    }, [animation, maxIterations, currentIteration, brightness]);
    // animate
    useAnimationFrame(() => {
        animation.update(bus.timestamp); return true;
    }, [animation])

    const intensity = useChange(animation, a => a.intensity)

    const handleBrightnessChange = async (ev: unknown, newValue: number | number[]) => {
        await brightnessRegister.sendSetPackedAsync("u16", [newValue as number], true);
    }

    // nothing to see
    if (intensity === undefined)
        return null;

    const w = 15.5;
    const h = 42;
    const r = w / 2;
    const sw = 2;
    return <Grid container direction="row">
        {host && <Grid item>
            <Slider
                orientation="vertical"
                min={0} max={0xffff}
                step={0xffff / 0xfff}
                color={color}
                valueLabelDisplay="off"
                value={brightness}
                onChange={handleBrightnessChange} />
        </Grid>}
        <Grid item>
            <SvgWidget width={w} height={h} size={widgetSize}>
                <path fill="#999" d="M14.2 13V7.1C14.2 3.2 11 0 7.1 0 3.2 0 0 3.2 0 7.1v13.7c1.9 1.9 4.4 2.9 7.1 2.8 4.6 0 8.4-2.6 8.4-5.9v-1.5c0-1.2-.5-2.3-1.3-3.2z" opacity=".65" />
                <path fill="#8c8c8c" d="M2.8 17.5l-1.2-1.4h1L5 17.5v18.6c0 .3-.5.5-1.1.5-.6 0-1.1-.2-1.1-.5zm10.1 6.7c0-.7-1.1-1.3-2.1-1.8-.4-.2-1.2-.6-1.2-.9v-3.4l2.5-2h-.9l-3.7 2v3.5c0 .7.9 1.2 1.9 1.7.4.2 1.3.8 1.3 1.1v16.9c0 .4.5.7 1.1.7.6 0 1.1-.3 1.1-.7z" />
                <path opacity={intensity} fill={active} d="M14.2 13V7.1C14.2 3.2 11 0 7.1 0 3.2 0 0 3.2 0 7.1v13.7c1.9 1.9 4.4 2.9 7.1 2.8 4.6 0 8.4-2.6 8.4-5.9v-1.5c0-1.2-.5-2.3-1.3-3.2z" />
                <path fill="#d1d1d1" d="M14.2 13v3.1c0 2.7-3.2 5-7.1 5-3.9 0-7.1-2.2-7.1-5v4.6c1.9 1.9 4.4 2.9 7.1 2.8 4.6 0 8.4-2.6 8.4-5.9v-1.5c0-1.1-.5-2.2-1.3-3.1z" opacity=".9" />
                <path fill="#e6e6e6" d="M14.2 13v3.1c0 2.7-3.2 5-7.1 5-3.9 0-7.1-2.2-7.1-5v4.6c1.9 1.9 4.4 2.9 7.1 2.8 4.6 0 8.4-2.6 8.4-5.9v-1.5c0-1.1-.5-2.2-1.3-3.1z" opacity=".7" />
                <path fill="#e6e6e6" d="M14.2 13v3.1c0 2.7-3.2 5-7.1 5-3.9 0-7.1-2.2-7.1-5v3.1c1.9 1.9 4.4 2.9 7.1 2.8 4.6 0 8.4-2.6 8.4-5.9 0-1.1-.5-2.2-1.3-3.1z" opacity=".25" />
                <ellipse cx="-7.2" cy="-16.1" fill="#e6e6e6" opacity=".25" rx="7.1" ry="5" transform="scale(-1)" />
                <ellipse cx="-7.2" cy="-16.1" fill="#e6e6e6" opacity=".25" rx="7.1" ry="5" transform="scale(-1)" />
                <path opacity=".61" fill="#fff" d="M7.2 22c-4.3 0-6.1-2-6.1-2l.7-.7S3.4 21 7.2 21c2.4.1 4.7-.9 6.3-2.7l.8.6C12.4 21 9.9 22.1 7.2 22z" />
                <path opacity=".61" fill="#fff" d="M2.6 3.2C1.5 4.3.9 5.8.9 7.4v10.3l1.9 1.5V8.8c-.9-2.8-.3-4.2.7-5.2-.3-.1-.6-.2-.9-.4zm7.3-1.6l-.3.9c1.5.7 2.6 2.1 2.8 3.7h1c-.3-2-1.6-3.7-3.5-4.6z" />
            </SvgWidget>
        </Grid>
    </Grid>
}