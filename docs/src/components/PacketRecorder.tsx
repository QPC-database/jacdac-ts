import { Tooltip, Typography } from "@material-ui/core";
import JACDACContext, { JDContextProps } from '../../../src/react/Context';
// tslint:disable-next-line: no-submodule-imports match-default-export-name
import ClearIcon from '@material-ui/icons/Clear';
// tslint:disable-next-line: no-submodule-imports match-default-export-name
// tslint:disable-next-line: no-submodule-imports match-default-export-name
import PlayArrowIcon from '@material-ui/icons/PlayArrow';
// tslint:disable-next-line: no-submodule-imports match-default-export-name
// tslint:disable-next-line: no-submodule-imports match-default-export-name
import StopIcon from '@material-ui/icons/Stop';
import { IconButton } from "gatsby-theme-material-ui";
import React, { useContext, useEffect, useState } from "react";
import PacketsContext from "./PacketsContext";
import TracePlayer from "../../../src/dom/traceplayer"
import useChange from "../jacdac/useChange";
import TraceImportButton from "./TraceImportButton";
import { PROGRESS } from "../../../src/dom/constants";
import CircularProgressWithLabel from "./CircularProgressWithLabel";
import SaveTraceButton from "./SaveTraceButton";
import TraceRecordFunction from "./TraceRecordButton";

export default function PacketRecorder() {
    const { bus, disconnectAsync } = useContext<JDContextProps>(JACDACContext)
    const { clearPackets, trace, recording } = useContext(PacketsContext)
    const [player, setPlayer] = useState<TracePlayer>(undefined);
    const [progress, setProgress] = useState(0)
    const tracing = useChange(player, p => !!p?.running);

    const disableSave = tracing;
    const disableTrace = !trace || recording || !player;

    useEffect(() => {
        const p = trace && new TracePlayer(bus, trace?.packets);
        setPlayer(p);
        return () => p?.stop();
    }, [trace]);
    useEffect(() => player?.subscribe(PROGRESS, (p: number) => setProgress(p)), [player]);

    const toggleTrace = async () => {
        if (player?.running) {
            player?.stop();
        } else {
            await disconnectAsync();
            setProgress(undefined);
            clearPackets();
            player?.start();
        }
    }

    return <>
        {tracing && <CircularProgressWithLabel value={progress * 100} />}
        {trace && !tracing && <Typography variant="caption">{trace.packets.length} packets</Typography>}
        <TraceImportButton icon={true} disabled={tracing || recording} />
        <SaveTraceButton disabled={disableSave} />
        |
        <Tooltip title={tracing ? "Stop trace" : "Play trace"}>
            <span><IconButton disabled={disableTrace} size="small" key="replay" onClick={toggleTrace}>{tracing ? <StopIcon /> : <PlayArrowIcon />}</IconButton></span>
        </Tooltip>
        |
        <TraceRecordFunction />
        <Tooltip title="Clear">
            <span><IconButton size="small" key="clear" onClick={clearPackets}><ClearIcon /></IconButton></span>
        </Tooltip>
    </>
}