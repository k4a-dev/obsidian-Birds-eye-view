import React from "react";
import NoteTile from "./noteTile";

import type { NoteType } from "./note";
const BirdsEyePage: React.FC<{ notes: NoteType[] }> = (p) => {
	return <NoteTile notes={p.notes} />;
};

export default BirdsEyePage;
