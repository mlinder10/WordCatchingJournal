import { useState } from "react";
import FloatingInput from "../../../components/floating-input/floating-input";
import LoadingButton from "../../../components/loading-button/loading-button";

export default function Page() {
  const [email, setEmail] = useState("");

  async function handleResetRequest() {}

  return (
    <div>
      <div>
        <FloatingInput
          placeholder="Email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <LoadingButton onClick={handleResetRequest} loading={false}>
          Send Email
        </LoadingButton>
      </div>
    </div>
  );
}
