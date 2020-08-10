import { JDNode } from "../../../src/dom/node";
import { CHANGE } from "../../../src/dom/constants";
import { useState, useEffect } from "react";

export default function useChange<TNode extends JDNode, TValue>(node: TNode, query?: (n: TNode) => TValue): TValue {
    const [version, setVersion] = useState(node?.changeId || 0)
    const value = query ? query(node) : undefined

    useEffect(() => node?.subscribe(CHANGE, () => {
        //console.log(`change ${node} ${version}->${node.changeId}`)
        setVersion(node.changeId)
    }), [node, version])

    return value;
}
