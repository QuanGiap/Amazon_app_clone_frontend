import "./App.css";
import RegistrationForm from "./components/registration/RegistrationForm";
import StyledEngineProvider from "@mui/material/StyledEngineProvider";
import React, { Component } from "react";
import AppBar from "@mui/material/AppBar";
import MenuIcon from "@mui/icons-material/Menu";
import ConfirmEmail from "./components/registration/ConfirmEmail";
import { Routes, Route, useNavigate } from "react-router-dom";
import {
  Grid,
  Toolbar,
  Typography,
  Button,
  IconButton,
  Box,
} from "@mui/material";
import Login from "./components/Pages/LoginPage/LoginPage";
import { getUserInfo } from "./components/tools/axiosFetch";
import destructAtr from "./components/tools/destructAtr";
import HomePage from "./components/Pages/HomePage/HomePage";
import ForgotPassPage from "./components/Pages/ForgotPassPage/ForgotPassPage";
import CreateProductPage from "./components/Pages/CreateProductPage/CreateProductPage";
import { IconMenu } from "./components/Menu/Menu";
import ManageProductPage from "./components/Pages/ManageProductPage/ManageProductPage";
import socket,{connectSocket,disconnectSocket} from "./components/tools/socketClient";
import InspectProductPage from "./components/Pages/InspectProductPage/InspectProductPage";
import MessageBox from "./components/MessageBox/MessageBox";
const test_case = {
  test: {
    user_name: "test",
    messages: [
      { is_owner: false, message: "This is a reply from other user" },
      { is_owner: false, message: "This is a reply" },
      { is_owner: false, message: "This is a reply from other user" },
      { is_owner: true, message: "This is a reply from you" },
      { is_owner: true, message: "This is a reply from you" },
      { is_owner: true, message: "This is a reply from you" },
      { is_owner: true, message: "This is a reply from you" },
      { is_owner: true, message: "This is a reply from you" },
      { is_owner: true, message: "This is a reply from you" },
      { is_owner: true, message: "This is a reply from you" },
    ],
  },
  test2: {
    user_name: "test2",
    messages: [
      { is_owner: false, message: "This is a reply from other user" },
      { is_owner: true, message: "This is a reply from you" },
    ],
  },
  test3: {
    user_name: "test3",
    messages: [
      { is_owner: false, message: "This is a reply from other user" },
      { is_owner: true, message: "This is a reply from you" },
    ],
  },
  test4: {
    user_name: "test4",
    messages: [
      { is_owner: false, message: "This is a reply from other user" },
      { is_owner: true, message: "This is a reply from you" },
    ],
  },
};
const test_chats_window = ["test", "test2", "test3"];
class App extends Component {
  constructor(props) {
    super(props);
    this.getInfo = this.getInfo.bind(this);
    this.LogOut = this.LogOut.bind(this);
    this.state = {
      username: "",
      user_data: null,
      user_chats:test_chats_window,
      users:test_case,
    };
  }
  async getInfo() {
    try {
      const {data} = await getUserInfo();
      console.log(data);
      const userInfo = destructAtr(data);
      this.setState({
        user_data: userInfo,
        username: data.Username,
      });
      connectSocket();
    } catch (err) {
      console.log(err);
      this.LogOut();
    }
  }
  LogOut() {
    localStorage.clear();
    this.props.nav("/");
    this.setState({ username: "", user_data: null });
    disconnectSocket();
  }
  componentDidMount() {
    const token = localStorage.getItem("access_token");
    if (token) {
      this.getInfo();
    }
  }
  render() {
    const { username, user_data,users,user_chats } = this.state;
    const { nav } = this.props;
    const menu_info = [
      { menu_item_name: "Home page", onClick: () => nav("/") },
      {
        menu_item_name: "Create product",
        onClick: () => nav("/create_product"),
      },
      {
        menu_item_name: "Manage your product",
        onClick: () => nav("/manage_product"),
      },
      { menu_item_name: "Log out", onClick: () => this.LogOut() },
    ];
    return (
      <StyledEngineProvider injectFirst>
        <AppBar className="bar-app">
          <Toolbar>
            <IconMenu
              menu_style={{
                size: "large",
                edge: "start",
                color: "inherit",
                sx: { mr: 2 },
              }}
              menu_items={menu_info}
              icon={<MenuIcon />}
            />
            <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
              Shop website
            </Typography>
            {!this.state.username && (
              <React.Fragment>
                <Button color="inherit" onClick={() => nav("/sign_up")}>
                  Sign up
                </Button>
                <Button color="inherit" onClick={() => nav("/sign_in")}>
                  Login
                </Button>
              </React.Fragment>
            )}
            {this.state.username && (
              <React.Fragment>
                <Typography>Hello {this.state.username}</Typography>
              </React.Fragment>
            )}
          </Toolbar>
        </AppBar>
        <Routes>
          <Route index element={<HomePage />} />
          <Route
            path="/product/:product_id"
            element={<InspectProductPage />}
          />
          <Route path="/sign_up" element={<RegistrationForm />} />
          <Route
            path="/sign_in"
            element={
              <Login
                getUserInfo={this.getInfo}
                navToMenuPage={() => nav("/")}
              />
            }
          />
          <Route
            path="/create_product"
            element={<CreateProductPage user_id={user_data?.sub} />}
          />
          <Route
            path="/confirm_code/:user_name/:checkSended"
            element={<ConfirmEmail />}
          />
          <Route
            path="/manage_product"
            element={<ManageProductPage user_id={user_data?.sub}/>}
          />
          <Route path="/forgot_pass" element={<ForgotPassPage />} />
        </Routes>
        <MessageBox users={users} user_chats={user_chats} setUsers={(funct)=>this.setState((prev_state)=>funct(prev_state.users))} setUsersChats={(funct)=>this.setState((prev_state)=>funct(prev_state.user_chats))}/>
      </StyledEngineProvider>
    );
  }
}

export default function AppWithRouter() {
  const nav = useNavigate();
  return <App nav={nav} />;
}
