"use client";

import { useState } from "react";
import { useOwner } from "@/context/OwnerContext";

export function OwnerBar() {
  const { isOwner, isLoading, login, logout } = useOwner();
  const [open, setOpen] = useState(false);
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  if (isLoading) return null;

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    const ok = await login(password);
    if (ok) {
      setOpen(false);
      setPassword("");
    } else {
      setError("Incorrect password");
    }
  };

  return (
    <div className={`owner-bar${isOwner ? " owner-bar--editing" : ""}`}>
      {isOwner ? (
        <div className="owner-bar__inner">
          <span className="owner-bar__label">Editing mode</span>
          <button type="button" className="owner-bar__btn" onClick={logout}>
            Sign out
          </button>
        </div>
      ) : (
        <>
          <button
            type="button"
            className="owner-bar__sign-in"
            onClick={() => setOpen(true)}
            aria-label="Owner sign in"
          />
          {open && (
            <div
              className="owner-bar__modal-backdrop"
              onClick={() => setOpen(false)}
              role="presentation"
            >
              <form
                className="owner-bar__modal"
                onClick={(e) => e.stopPropagation()}
                onSubmit={handleLogin}
              >
                <h2>Owner sign in</h2>
                <p>Enter your password to edit the site.</p>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Password"
                  autoFocus
                />
                {error && <p className="owner-bar__error">{error}</p>}
                <div className="owner-bar__actions">
                  <button type="button" onClick={() => setOpen(false)}>
                    Cancel
                  </button>
                  <button type="submit" className="owner-bar__btn">
                    Sign in
                  </button>
                </div>
              </form>
            </div>
          )}
        </>
      )}
    </div>
  );
}
