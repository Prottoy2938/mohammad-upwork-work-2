"use client";
import signUp from "@/firebase/auth/signup";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { TextField, Button } from "@material-ui/core";
import { Alert } from "@material-ui/lab";

function Page(): JSX.Element {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const router = useRouter();

  // Handle form submission
  const handleForm = async (event: { preventDefault: () => void }) => {
    event.preventDefault();

    // Attempt to sign up with provided email and password
    const { result, error } = await signUp(email, password);

    if (error) {
      // Display and log any sign-up errors
      console.log(error);
      // @ts-expect-error
      setError(error.message);
      return;
    }

    // Sign up successful
    console.log(result);

    // Redirect to the admin page
    router.push("/");
  };

  return (
    <div className="flex justify-center items-center h-screen text-black">
      <div className="w-96 bg-white rounded shadow p-6">
        <h1 className="text-3xl font-bold mb-6">Registration</h1>
        <form onSubmit={handleForm} className="space-y-4">
          <div>
            <label htmlFor="email" className="block mb-1 font-medium">
              Email
            </label>
            <TextField
              onChange={(e) => setEmail(e.target.value)}
              required
              type="email"
              name="email"
              id="email"
              placeholder="example@mail.com"
              className="w-full"
            />
          </div>
          <div>
            <label htmlFor="password" className="block mb-1 font-medium">
              Password
            </label>
            <TextField
              onChange={(e) => setPassword(e.target.value)}
              required
              type="password"
              name="password"
              id="password"
              placeholder="password"
              className="w-full"
            />
          </div>
          <Button
            type="submit"
            variant="contained"
            color="primary"
            className="w-full"
          >
            Sign up
          </Button>
        </form>
        {error && <Alert severity="warning">{error}</Alert>}
        <a href="/signin" style={{ marginTop: "15px" }}>
          Have an Account? Sign In
        </a>
      </div>
    </div>
  );
}

export default Page;
