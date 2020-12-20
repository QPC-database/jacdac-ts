import { createStyles, makeStyles, Theme } from "@material-ui/core";
import React, { useContext, useEffect, useRef } from "react";
import { PACKET_PROCESS, PACKET_SEND } from "../../../../src/jdom/constants";
import { PacketMessage } from "../../../../src/jdom/iframebridgeclient";
import Packet from "../../../../src/jdom/packet";
import JACDACContext, { JDContextProps } from "../../../../src/react/Context";
import useWindowEvent from "../hooks/useWindowEvent";
import PaperBox from "../PaperBox";
import MakeCodeSnippetContext from "./MakeCodeSnippetContext";
import { MakeCodeSnippetSource } from "./useMakeCodeRenderer";

const useStyles = makeStyles((theme: Theme) => createStyles({
    root: {
        width: "100%",
    },
    root2: {
        position: "relative",
        paddingTop: "86.75%"
    },
    iframe: {
        position: "absolute",
        left: 0,
        top: 0,
        border: "none",
        width: "100%",
        height: "100%"
    }
}));

export default function MakeCodeSimulator(props: { snippet: MakeCodeSnippetSource }) {
    const { simUrl } = useContext(MakeCodeSnippetContext);
    const { snippet } = props;
    const { code, ghost, meta } = snippet;
    const { dependencies } = meta;
    const { bus } = useContext<JDContextProps>(JACDACContext);
    const frameRef = useRef<HTMLIFrameElement>();
    const classes = useStyles();

    const src = `${ghost || ""}\n${code || ""}`;
    const url = `${simUrl}#deps=${encodeURIComponent(dependencies.join(','))}&code=${encodeURIComponent(src)}`
    const origin = new URL(url).origin;

    useEffect(() => bus.subscribe([PACKET_SEND, PACKET_PROCESS], (pkt: Packet) => {
        this.packetSent++;
        const msg: PacketMessage = {
            type: "messagepacket",
            channel: "jacdac",
            broadcast: true,
            data: pkt.toBuffer(),
            sender: pkt.sender
        }
        frameRef.current?.contentWindow?.postMessage(msg, origin);
    }))

    return <PaperBox>
        <div className={classes.root}>
            <div className={classes.root2}>
                <iframe ref={frameRef} className={classes.iframe} src={url} />
            </div>
        </div>
    </PaperBox>
}