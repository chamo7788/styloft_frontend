import { useState, useEffect } from "react";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import DashBoardProfile from "../components/DashBoard/DashBoardProfile";
import DashBoardCard from "../components/DashBoard/DashBoardCard";




export default function DashBoard() {
  return (
    <>
      <DashBoardProfile />
      <DashBoardCard />
    </>
  );
}
