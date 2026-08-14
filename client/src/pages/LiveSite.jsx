import React from "react";
import { useEffect } from "react";
import { useParams } from "react-router-dom";
import { serverUrl } from "../App";
import axios from "axios";
import { useState } from "react";
import { error } from "three/src/utils.js";

function LiveSite() {
  const { id } = useParams();
  const [html, setHtml] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    const handleGetWebsite = async () => {
      try {
        const result = await axios.get(
          `${serverUrl}/api/website/get-by-slug/${id}`,
          {
            withCredentials: true,
          },
        );

        setHtml(result.data.latestCode);
      } catch (err) {
        console.log(err);
        setError("Site not found");
      }
    };

    handleGetWebsite();
  }, [id]);

  if (error) {
    return (
      <div className="h-screen flex items-center justify-center bg-black text-white">
        {error}
      </div>
    );
  }

  if (!html) {
    return (
      <div className="h-screen flex items-center justify-center">
        Loading...
      </div>
    );
  }

  return (
    <iframe
      title="Live site"
      srcDoc={html}
      className="w-screen h-screen border-none"
      sandbox="allow-scripts allow-same-origin allow-forms"
    />
  );
}

export default LiveSite;
