import React from "react";
import { Routes, Route } from "react-router-dom";
import ViewContest from "../components/contest/ViewContest";
import { AddContestForm } from "../components/contest/AddContest";
import ContestContent from "../components/contest/ContestContent";

export default function Contest() {
    return (
        <Routes>
            <Route path="/" element={<ViewContest />} />
            <Route path="add-contest" element={<AddContestForm />} />
            <Route path=":id" element={<ContestContent />} />
        </Routes>
    );
}