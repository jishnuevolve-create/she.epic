// @vitest-environment jsdom
import React from "react";
import { it, expect, vi } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { ContactForm } from "@/features/contact/ContactForm";
it("shows validation before attempting a network request", async () => {
  const request = vi.spyOn(globalThis, "fetch");
  render(<ContactForm />);
  fireEvent.click(screen.getByRole("button", { name: /send your note/i }));
  await waitFor(() => expect(screen.getAllByRole("alert").length).toBeGreaterThan(0));
  expect(request).not.toHaveBeenCalled();
  request.mockRestore();
});
