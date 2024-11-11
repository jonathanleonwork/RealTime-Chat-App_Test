import React, { useEffect, useRef, useState } from "react";
import { Divider } from "rsuite";
import DashboardToggle from "./dashboard/DashboardToggle";
import ChatUserList from "./users/ChatUserList";

const Sidebar = () => {
  const topSidebarRef = useRef();
  const [height, setHeight] = useState(0);

  useEffect(() => {
    if (topSidebarRef.current) {
      setHeight(topSidebarRef.current.scrollHeight);
    }
  }, [topSidebarRef]);

  return (
    <div className="h-100 pt-2">
      <div ref={topSidebarRef}>
        <DashboardToggle />
        <Divider>Join conversation</Divider>
      </div>
      <ChatUserList aboveElHeight={height} />
    </div>
  );
};

export default Sidebar;
