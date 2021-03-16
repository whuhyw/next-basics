import {
  BuilderRuntimeNode,
  useBuilderData,
} from "@next-core/editor-bricks-helper";
import { useCallback } from "react";
import { BuilderClipboard, BuilderClipboardType } from "../interfaces";

export type CanPaste = (
  clipboard: BuilderClipboard,
  node: BuilderRuntimeNode
) => boolean;

/**
 * Returns whether the current clipboard node can be pasted
 * inside specific node.
 *
 * This is useful for checking available paste zone and preventing
 * pasting a node into its self or descendants.
 */
export function useCanPaste(): CanPaste {
  const { nodes, edges } = useBuilderData();
  return useCallback(
    (clipboard: BuilderClipboard, targetNode: BuilderRuntimeNode) => {
      if (!clipboard || !targetNode) {
        return false;
      }
      let sourceNode: BuilderRuntimeNode;
      if (clipboard.type === BuilderClipboardType.CUT) {
        sourceNode = nodes.find(
          (n) => n.instanceId === clipboard.sourceInstanceId
        );
      } else {
        sourceNode = nodes.find((n) => n.id === clipboard.sourceId);
      }
      if (!sourceNode) {
        // The source node is identified by url params,
        // so it maybe not found if the params and manually specified.
        return false;
      }
      const traverse = (parentId: number): boolean => {
        if (parentId === targetNode.$$uid) {
          return false;
        }
        return !edges.some((edge) => {
          if (edge.parent === parentId) {
            return !traverse(edge.child);
          }
          return false;
        });
      };
      return traverse(sourceNode.$$uid);
    },
    [edges, nodes]
  );
}
