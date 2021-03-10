import React from "react";
import { Menu } from "antd";
import {
  useBuilderContextMenuStatus,
  useBuilderDataManager,
  BuilderRuntimeNode,
} from "@next-core/editor-bricks-helper";
import { useBuilderUIContext } from "../BuilderUIContext";
import { BuilderDataType, ToolboxTab } from "../interfaces";

import styles from "./BuilderContextMenu.module.css";

export interface BuilderContextMenuProps {
  onAskForDeletingNode?: (node: BuilderRuntimeNode) => void;
}

export function BuilderContextMenu({
  onAskForDeletingNode,
}: BuilderContextMenuProps): React.ReactElement {
  const contextMenuStatus = useBuilderContextMenuStatus();
  const manager = useBuilderDataManager();
  const {
    dataType,
    setToolboxTab,
    setEventStreamNodeId,
  } = useBuilderUIContext();

  const handleCloseMenu = React.useCallback(
    (event: React.MouseEvent) => {
      event.preventDefault();
      manager.contextMenuChange({
        active: false,
      });
    },
    [manager]
  );

  const handleDeleteNode = React.useCallback(() => {
    onAskForDeletingNode(contextMenuStatus.node);
  }, [contextMenuStatus.node, onAskForDeletingNode]);

  const handleShowEventsView = React.useCallback(() => {
    setToolboxTab(ToolboxTab.EVENTS_VIEW);
    setEventStreamNodeId(contextMenuStatus.node.id);
  }, [contextMenuStatus.node, setEventStreamNodeId, setToolboxTab]);

  return (
    <div
      className={styles.menuWrapper}
      style={{
        display: contextMenuStatus.active ? "block" : "none",
      }}
      onClick={handleCloseMenu}
      onContextMenu={handleCloseMenu}
    >
      {contextMenuStatus.active && (
        <Menu
          prefixCls="ant-dropdown-menu"
          style={{
            left: contextMenuStatus.x,
            top: contextMenuStatus.y,
            width: "fit-content",
          }}
        >
          {dataType !== BuilderDataType.ROUTE_OF_ROUTES && (
            <Menu.Item key="events-view" onClick={handleShowEventsView}>
              Events View
            </Menu.Item>
          )}
          <Menu.Item key="delete" onClick={handleDeleteNode}>
            Delete
          </Menu.Item>
        </Menu>
      )}
    </div>
  );
}
