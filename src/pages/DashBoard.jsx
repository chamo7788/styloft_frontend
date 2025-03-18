import { useState, useEffect } from "react";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import DashBoardProfile from "../components/DashBoard/DashBoardProfile";




export default function DashBoard() {
  return (
    <>
      <DashBoardProfile />
    </>
  );
}
