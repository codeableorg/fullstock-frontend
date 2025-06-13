import { describe, expect, it, vi, afterEach } from "vitest";
import { redirect } from "react-router";

import { createTestRequest } from "@/lib/utils.tests";
import * as AuthService from "@/services/auth.service";
import type { Route } from "./+types";

import { loader } from ".";

vi.mock("@/services/auth.service", () => ({
  redirectIfAuthenticated: vi.fn(),
}));

describe("signup.loader", () => {
  afterEach(() => {
    vi.clearAllMocks();
  });

  it("should call redirectIfAuthenticated with request", async () => {
    // Step 1: Setup/Arrange
    const request = createTestRequest();
    const loaderArgs: Route.LoaderArgs = { request, params: {}, context: {} };

    // Step 2: Mock 
    vi.mocked(AuthService.redirectIfAuthenticated).mockResolvedValueOnce(null);

    // Step 3: Call/Act
    const result = await loader(loaderArgs);

    // Step 4: Verify/Assert
    expect(AuthService.redirectIfAuthenticated).toHaveBeenCalledTimes(1);
    expect(AuthService.redirectIfAuthenticated).toHaveBeenCalledWith(request);
  });

  it("should return null when user is not authenticated", async () => {
    // Step 1: Setup/Arrange
    const request = createTestRequest();
    const loaderArgs: Route.LoaderArgs = { request, params: {}, context: {} };

    // Step 2: Mock
    vi.mocked(AuthService.redirectIfAuthenticated).mockResolvedValueOnce(null);

    // Step 3: Call/Act
    const result = await loader(loaderArgs);

    // Step 4: Verify/Assert
    expect(result).toBeNull();
  });

  it("should throw redirect when user is authenticated", async () => {
    // Step 1: Setup/Arrange
    const request = createTestRequest();
    const loaderArgs: Route.LoaderArgs = { request, params: {}, context: {} };
    const redirectResponse = redirect("/");

    // Step 2: Mock
    vi.mocked(AuthService.redirectIfAuthenticated).mockImplementationOnce(() => {
      throw redirectResponse;
    });

    // Step 3 & 4: Call and Verify
    await expect(loader(loaderArgs)).rejects.toBe(redirectResponse);
  });
});