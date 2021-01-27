import React, { CSSProperties, useRef } from "react";
import { SoilMoistureReg, SoilMoistureVariant } from "../../../../src/jdom/constants";
import { DashboardServiceProps } from "./DashboardServiceWidget";
import { useRegisterUnpackedValue } from "../../jacdac/useRegisterValue";
import useWidgetSize from "../widgets/useWidgetSize";
import useServiceHost from "../hooks/useServiceHost";
import { SvgWidget } from "../widgets/SvgWidget";
import useWidgetTheme from "../widgets/useWidgetTheme";
import JDSensorServiceHost from "../../../../src/hosts/sensorservicehost";
import { scaleFloatToInt, scaleIntToFloat } from "../../../../src/jacdac";
import { useId } from "react-use-id-hook";
import { closestPoint, svgPointerPoint } from "../widgets/svgutils";
import { Grid, Slider } from "@material-ui/core";


export default function DashboardSoilMoisture(props: DashboardServiceProps) {
    const { service, services, variant } = props;
    const moistureReg = service.register(SoilMoistureReg.Moisture);
    const [moisture] = useRegisterUnpackedValue<[number]>(moistureReg);
    const widgetSize = useWidgetSize(variant, services.length);
    const host = useServiceHost<JDSensorServiceHost<[number]>>(service);
    const color = host ? "secondary" : "primary";
    const { active, background, controlBackground, textProps } = useWidgetTheme(color);
    const clipId = useId();

    const value = scaleIntToFloat(moisture, moistureReg.specification.fields[0]);
    const hasValue = !isNaN(value);
    const tvalue = hasValue ? `${Math.round(value * 100)}%` : `--`

    const w = 5;
    const h = 9.488;
    const sw = 0.5;
    const cm = 3.3;
    const ch = (h - cm) * ((0.12 + value) / 1.12);
    const onChange = (event: unknown, newValue: number | number[]): void => {
        const svalue = scaleFloatToInt(newValue as number, moistureReg.specification.fields[0]);
        host?.reading.setValues([svalue])
    }

    return <Grid container direction="row">
        {host && hasValue && <Grid item>
            <Slider
                orientation="vertical"
                valueLabelDisplay="off"
                min={0} max={1} step={0.05}
                value={value}
                onChange={onChange}
                color={color}
            />
        </Grid>}
        <Grid item>
            <SvgWidget width={w} height={h} size={widgetSize}>
                {hasValue && <defs>
                    <clipPath id={clipId}>
                        <rect x={0} y={h - ch} width={w} height={ch} />
                    </clipPath>
                </defs>}
                <path fill={background} d="M4.812 7.997V.5a.5.5 0 00-.5-.5H.689a.5.5 0 00-.5.5v7.497l.503 1.491h.466l.503-1.491V3.373a.792.792 0 01.84-.791.792.792 0 01.838.79v4.625l.503 1.491h.466z" />
                <path fill={active} d="M4.812 7.997V.5a.5.5 0 00-.5-.5H.689a.5.5 0 00-.5.5v7.497l.503 1.491h.466l.503-1.491V3.373a.792.792 0 01.84-.791.792.792 0 01.838.79v4.625l.503 1.491h.466z"
                    clipPath={`url(#${clipId})`}
                />
                <path fill={controlBackground} d="M4.075 8.548a.075.075 0 100-.15.075.075 0 100 .15zM4.425 7.281a.075.075 0 100-.15.075.075 0 100 .15zM4.425 5.948a.075.075 0 100-.15.075.075 0 100 .15zM3.725 4.614a.075.075 0 100-.15.075.075 0 100 .15zM3.725 3.948a.075.075 0 100-.15.075.075 0 100 .15zM3.725 5.281a.075.075 0 100-.15.075.075 0 100 .15zM4.425 6.614a.075.075 0 100-.15.075.075 0 100 .15zM4.425 7.948a.075.075 0 100-.15.075.075 0 100 .15zM3.725 7.281a.075.075 0 100-.15.075.075 0 100 .15zM3.725 5.948a.075.075 0 100-.15.075.075 0 100 .15zM4.425 4.614a.075.075 0 100-.15.075.075 0 100 .15zM4.425 3.948a.075.075 0 100-.15.075.075 0 100 .15zM4.425 5.281a.075.075 0 100-.15.075.075 0 100 .15zM3.725 6.614a.075.075 0 100-.15.075.075 0 100 .15zM3.725 7.948a.075.075 0 100-.15.075.075 0 100 .15zM.925 8.548a.075.075 0 100-.15.075.075 0 100 .15zM.575 7.281a.075.075 0 100-.15.075.075 0 100 .15zM.575 5.948a.075.075 0 100-.15.075.075 0 100 .15zM1.275 4.614a.075.075 0 100-.15.075.075 0 100 .15zM1.275 3.948a.075.075 0 100-.15.075.075 0 100 .15zM1.275 5.281a.075.075 0 100-.15.075.075 0 100 .15zM.575 6.614a.075.075 0 100-.15.075.075 0 100 .15zM.575 7.948a.075.075 0 100-.15.075.075 0 100 .15zM1.275 7.281a.075.075 0 100-.15.075.075 0 100 .15zM1.275 5.948a.075.075 0 100-.15.075.075 0 100 .15zM.575 4.614a.075.075 0 100-.15.075.075 0 100 .15zM.575 3.948a.075.075 0 100-.15.075.075 0 100 .15zM.575 5.281a.075.075 0 100-.15.075.075 0 100 .15zM1.275 6.614a.075.075 0 100-.15.075.075 0 100 .15zM1.275 7.948a.075.075 0 100-.15.075.075 0 100 .15z" />
                <text x={w / 2} y="1.4" fontSize="1.058" strokeWidth=".026" {...textProps}>{tvalue}</text>
            </SvgWidget>
        </Grid>
    </Grid>
}