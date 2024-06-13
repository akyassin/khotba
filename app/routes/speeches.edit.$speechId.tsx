import { useLoaderData, useActionData } from "@remix-run/react";
import {
  LoaderFunction,
  ActionFunction,
  redirect,
  json,
} from "@remix-run/node";
import { prisma } from "~/utils/prisma.server";
import SpeechForm from "~/components/SpeechForm"; // Adjust the import path

export const loader: LoaderFunction = async ({ params }) => {
  const { speechId } = params;
  const speech = await prisma.speech.findUnique({
    where: { id: parseInt(speechId as string) },
  });
  const languages = await prisma.language.findMany();
  const speeches = await prisma.speech.findMany({
    where: {
      NOT: {
        id: parseInt(speechId as string),
      },
    },
  });

  if (!speech) {
    throw new Response("Speech not found", { status: 404 });
  }

  return { speech, languages, speeches };
};

export const action: ActionFunction = async ({ request, params }) => {
  const formData = await request.formData();
  const title = formData.get("title");
  const body = formData.get("body");
  const languageId = formData.get("languageId");
  const relatedSpeechId = formData.get("relatedSpeechId");

  if (
    typeof title !== "string" ||
    typeof body !== "string" ||
    typeof languageId !== "string"
  ) {
    return json({ error: "Invalid form data" }, { status: 400 });
  }

  try {
    const { speechId } = params;
    await prisma.speech.update({
      where: { id: parseInt(speechId as string) },
      data: {
        title,
        body,
        languageId: parseInt(languageId),
        relatedSpeechId: relatedSpeechId
          ? parseInt(relatedSpeechId as string)
          : null,
      },
    });

    return redirect("/");
  } catch (error) {
    const err = error as { code?: string };

    if (err.code === "P2002") {
      return json(
        { error: "This translation is connected to another khotba." },
        { status: 500 }
      );
    } else {
      return json({ error: "Failed to update speech" }, { status: 500 });
    }
  }
};

export default function EditSpeech() {
  const { speech, languages, speeches } = useLoaderData<typeof loader>();
  const actionData = useActionData<typeof action>();

  return (
    <div className="flex justify-center min-h-screen bg-gray-100">
      <div className="w-full sm:w-2/3 md:w-90% mt-16">
        <div className="flex flex-col sm:flex-row justify-between items-center bg-gray-700 text-white p-4 rounded-t">
          <h2 className="text-2xl font-semibold mb-2 sm:mb-0">Edit Speech</h2>
        </div>
        <SpeechForm
          speech={speech}
          languages={languages}
          speeches={speeches}
          actionData={actionData}
          onSubmit={(data) => {
            // handle form submission
          }}
        />
      </div>
    </div>
  );
}
