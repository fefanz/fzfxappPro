import { signIn } from "../../auth";

export default function Landing() {
  return (
    <main style={{ display: "grid", placeItems: "center", minHeight: "100vh" }}>
      <div style={{ textAlign: "center", maxWidth: 520 }}>
        <h1>FZFX Trade Validator</h1>
        <p>Confluence checklist, trade journal, and dashboard.</p>
        <form
          action={async () => {
            "use server";
            await signIn("google");
          }}
        >
          <button
            type="submit"
            style={{
              padding: "0.75rem 1.25rem",
              marginTop: "1rem",
              borderRadius: 12,
              border: "1px solid #111",
              background: "black",
              color: "white",
              cursor: "pointer",
              fontSize: "1rem",
            }}
          >
            Continue with Google
          </button>
        </form>
      </div>
    </main>
  );
}


