import React from "react";
import { Routes, Route } from "react-router-dom";
import { ViewContest, AddContest, ContestContent } from "../components/contest";

export default function Contest() {
    return (
        <Routes>
            <Route path="/" element={<ViewContest />} />
            <Route path="add-contest" element={<AddContest />} />
            <Route path=":id" element={<ContestContent />} />
        </Routes>
    );
}