import { useContext, useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Button,
} from "@mui/material";
import { LayoutContext } from "contexts";
import { Icon as ParentIcon } from "@mui/material";
import { InlineIcon } from "@iconify/react-with-api";
import { API } from "helpers";
import { LayoutConfig } from "constants/index";

export const SideMenuItems = () => {
  const { setPageTitle, layoutConfiguration, currentUserRole } =
    useContext(LayoutContext);
  const [selectedIndex, setSelectedIndex] = useState(0);

  const menuitemsController = (value, key) => {
    switch (value.type) {
      case "button":
        return renderMenuButton(
          value.name,
          value.icon,
          value.helpingAttribute,
          value.customTitle,
          key
        );
      case "logout":
        return renderLogoutButton(value.name, value.icon, key);
      default:
        return null;
    }
  };

  useEffect(() => {
    if (undefined !== layoutConfiguration) {
      let counter = 0;
      let _pathtoCheck = String(window.location.pathname).split("/");
      let _controllerArr;
      layoutConfiguration.getMenuItems(currentUserRole).forEach((value) => {
        _controllerArr = String(value.helpingAttribute).split("/");
        if (value.isFavourite) {
          if (
            _pathtoCheck[1] ===
            (_controllerArr[0] === "" ? _controllerArr[1] : _controllerArr[0])
          ) {
            setSelectedIndex(counter);
          }
          counter++;
        }
      });
      if (_pathtoCheck[1] === "menu") {
        setSelectedIndex(counter + 1);
      }
    }
  }, [currentUserRole, layoutConfiguration]);

  const handleListItemClick = (event, index) => {
    setSelectedIndex(index);
  };

  const renderMenuButton = (name, icon, link, customTitle, key) => {
    return (
      <ListItem
        key={key}
        button
        selected={selectedIndex === key}
        component={Link}
        to={link}
        onClick={(e) => {
          handleListItemClick(e, key);
          return setPageTitle(
            customTitle === undefined || customTitle === "" ? name : customTitle
          );
        }}
      >
        <ListItem>
          <Button
            style={{
              paddingRight: "30%",
              marginLeft: "-5%",
            }}
          >
            <ListItemIcon>
              <ParentIcon
                style={{
                  margin: "0 0 6px px",
                  width: "100%",
                  height: "20%",
                }}
              >
                <InlineIcon
                  style={{
                    height: "20px",
                    marginBottom: "15%",
                  }}
                  icon={icon}
                />
              </ParentIcon>
            </ListItemIcon>
            <ListItemText
              primary={name}
              primaryTypographyProps={{
                style: {
                  fontSize: "10px",
                  fontFamily: "Montserrat",
                  marginTop: "10%",
                },
              }}
            />
          </Button>
        </ListItem>
      </ListItem>
    );
  };

  const renderLogoutButton = (name, icon, key) => {
    return (
      <ListItem
        key={key}
        button
        onClick={() => {
          API.logoutUser();
        }}
        style={{ marginTop: "60vh" }}
      >
        <ListItemIcon>
          <ParentIcon
            style={{
              margin: "0 0 6px px",
              width: "100%",
              height: "20%",
            }}
          >
            <InlineIcon
              icon={icon}
              style={{
                height: "20px",
                marginLeft: "17px",
              }}
            />
          </ParentIcon>
        </ListItemIcon>
        <ListItemText
          primary={name}
          primaryTypographyProps={{
            style: {
              fontSize: "10px",
              fontFamily: "Montserrat",
              marginTop: "10%",
            },
          }}
        />
      </ListItem>
    );
  };

  return (
    <List>
      {LayoutConfig.getMenuItems(currentUserRole).map((value, i) => {
        return menuitemsController(value, i);
      })}
    </List>
  );
};
