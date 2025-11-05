"use client";

import { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { useParams, useSearchParams } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";

const PageName = () => {
  const [data, setData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const params = useParams();
  const searchParams = useSearchParams();
  const dispatch = useDispatch();
  const form = useSelector((state) => state.form);

  const getData = useCallback(async () => {
    return;
    try {
      setIsLoading(true);
      const response = await axios.get("/api/dataEndpoint");
      setData(response.data);
    } catch (err) {
      console.error(err.response ? err.response.data : err.message);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    getData();
  }, []);

  return <div></div>;
};

export default PageName;
