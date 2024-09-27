import axios from "axios";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import LoadableData from "../../../components/loadable-data/loadable-data";

export default function Page() {
  const { userId } = useParams();
  const [isValid, setIsValid] = useState<boolean | null>(null);
  const [validLoading, setValidLoading] = useState(false);
  const [validError, setValidError] = useState<string | null>(null);

  async function checkValidReset() {
    setValidLoading(true);
    setValidError(null);
    try {
      const res = await axios.get(`/api/auth/valid-reset/${userId}`);
      setIsValid(res.data.valid);
    } catch (err) {
      console.error(err);
      setValidError("Failed to check validity");
    } finally {
      setValidLoading(false);
    }
  }

  useEffect(() => {
    checkValidReset();
  }, []);

  return (
    <LoadableData loading={validLoading} error={validError}>
      {isValid ? <ValidReset /> : <InvalidReset />}
    </LoadableData>
  );
}

function ValidReset() {
  return (
    <div>
      <h1>Valid Reset</h1>
    </div>
  );
}

function InvalidReset() {
  return (
    <div>
      <h1>Invalid Reset</h1>
    </div>
  );
}
