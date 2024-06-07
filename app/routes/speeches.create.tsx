// app/routes/admin/new.tsx
import { Form, useActionData } from "@remix-run/react";
import { ActionFunction, redirect, json } from "@remix-run/node";
import { prisma } from "~/utils/prisma.server";

export const action: ActionFunction = async ({ request }) => {
  let formData = await request.formData();
  let title = formData.get("title");
  let body = formData.get("body");

  if (typeof title !== "string" || typeof body !== "string") {
    return json({ error: "Invalid form data" }, { status: 400 });
  }

  await prisma.speech.create({
    data: { title, body },
  });

  return redirect("/admin");
};

export default function NewSpeech() {
  let actionData = useActionData<typeof action>();
  return (
    <div>
      <h1>New Speech</h1>
      <Form method="post">
        <div>
          <label>
            Title: <input type="text" name="title" />
          </label>
        </div>
        <div>
          <label>
            Body: <textarea name="body"></textarea>
          </label>
        </div>
        {actionData?.error && (
          <p style={{ color: "red" }}>{actionData.error}</p>
        )}
        <div>
          <button type="submit">Create</button>
        </div>
      </Form>
    </div>
  );
}
