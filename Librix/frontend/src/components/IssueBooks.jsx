import React, { useState } from "react";
import Input from "./Input";
import axios from "axios";
import { useNavigate, useParams } from "react-router";
import link from "./link.json";
import QrCodeScanner from "./QrCodeScanner";
function IssueBooks() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [err, setErr] = useState("");

  const handleSuccess = async (decodedText, decodedResult) => {
    console.log(decodedText);
    const token = localStorage.getItem("jwtToken");
    try {
      setErr("");
      const book = JSON.parse(decodedText);
      console.log(book);
      if (book) {
        console.log(book.Name);
        const response = await axios.post(
          `${link.url}/${id}/issue-book`,
          {
            bookName: book.Name,
            bId: book.Id,
          },
          { headers: { Authorization: `Bearer ${token}` } },
        );
        if (response.status === 200) navigate(`/${id}/userInfo`);
      }
    } catch (error) {
      console.log(error);
      if (error.response === 401) return setErr("Book Already Issued");
      else if (error.response === 404)
        return setErr("No such book in the database");
      else setErr(error.message);
    }
  };
  const handleError = () => {};
  return (
    <>
      {err && <div className="text-2xl text-red-600">{err}</div>}

      <div id="reader"></div>
      <QrCodeScanner
        height={500}
        id="reader"
        width={500}
        fps={5}
        onSuccess={handleSuccess}
        onError={handleError}
      />
    </>
  );
}

export default IssueBooks;
