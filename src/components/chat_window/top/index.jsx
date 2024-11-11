import React, { memo } from "react";
import { Link } from "react-router-dom";
import { useCurrentUser } from "../../../context/current-user.context";
import ArowBackIcon from "@rsuite/icons/ArowBack";
import { useMediaQuery } from "../../../misc/custom-hooks";
import { ButtonToolbar } from "rsuite";
import EditUserBtnDrawer from "./EditUserBtnDrawer";

const ChatTop = () => {
  const name = useCurrentUser((v) => v.name);
  const isMobile = useMediaQuery("(max-width: 992px)");
  const isAdmin = useCurrentUser((v) => v.isAdmin);

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center">
        <h4 className="text-disappear d-flex align-items-center">
          <Link to={"/"} className="link-unstyled">
            <ArowBackIcon
              className={
                isMobile ? "d-inline-block p-0 mr-2 text-blue" : "d-none"
              }
            />
          </Link>
          <span className="text-disappear">{name}</span>
        </h4>

        <ButtonToolbar className="ws-nowrap">
          {isAdmin && <EditUserBtnDrawer />}
        </ButtonToolbar>
      </div>
    </div>
  );
};

export default memo(ChatTop);
