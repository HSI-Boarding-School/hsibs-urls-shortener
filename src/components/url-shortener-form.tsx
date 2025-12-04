"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { isValidUrl, normalizeUrl, isValidShortCode } from "@/lib/utils";
import CopyButton from "@/components/copy-button";
import { useToast } from "@/hooks/useToast";

// ============================================
// URL SHORTENER FORM COMPONENT
// ============================================

export default function URLShortenerForm() {
  // ========== STATE MANAGEMENT ==========
  const [originalUrl, setOriginalUrl] = useState("");
  const [customCode, setCustomCode] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<{
    short_code: string;
    original_url: string;
  } | null>(null);
  const [codeAvailability, setCodeAvailability] = useState<{
    checking: boolean;
    available: boolean | null;
    message: string;
  }>({
    checking: false,
    available: null,
    message: "",
  });

  const toast = useToast();

  // ========== VALIDATION ==========
  const validateUrl = (url: string): boolean => {
    if (!url.trim()) return false;
    const normalized = normalizeUrl(url);
    return isValidUrl(normalized);
  };

  // ========== CHECK CODE AVAILABILITY ==========
  const checkCodeAvailability = async (code: string) => {
    if (!code.trim()) {
      setCodeAvailability({ checking: false, available: null, message: "" });
      return;
    }

    // Validate format first
    if (!isValidShortCode(code)) {
      setCodeAvailability({
        checking: false,
        available: false,
        message:
          "Format tidak valid (3-16 karakter alfanumerik, bukan pure angka)",
      });
      return;
    }

    setCodeAvailability({
      checking: true,
      available: null,
      message: "Checking...",
    });

    try {
      const response = await fetch(`/api/urls/check/${code}`);
      const data = await response.json();

      if (data.success) {
        setCodeAvailability({
          checking: false,
          available: data.data.available,
          message: data.data.message,
        });
      }
    } catch (error) {
      console.error("CHECK ERROR =>", error);
      setCodeAvailability({
        checking: false,
        available: null,
        message: "Error checking availability",
      });
    }
  };

  // ========== DEBOUNCE CHECK ==========
  const handleCustomCodeChange = (value: string) => {
    setCustomCode(value);

    // Debounce check availability
    const timeoutId = setTimeout(() => {
      checkCodeAvailability(value);
    }, 500);

    return () => clearTimeout(timeoutId);
  };

  // ========== SUBMIT HANDLER ==========
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate URL
    if (!validateUrl(originalUrl)) {
      toast.error("URL tidak valid", "Pastikan URL yang kamu masukkan benar");
      return;
    }

    // Check custom code availability
    if (customCode && !codeAvailability.available) {
      toast.error("Kode tidak tersedia", codeAvailability.message);
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch("/api/urls", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          original_url: normalizeUrl(originalUrl),
          short_code: customCode || undefined,
        }),
      });

      const data = await response.json();

      if (data.success) {
        setResult(data.data);
        setOriginalUrl("");
        setCustomCode("");
        setCodeAvailability({ checking: false, available: null, message: "" });

        toast.success("Berhasil! 🎉", "Link pendek berhasil dibuat");
      } else {
        toast.error("Gagal membuat link", data.error.message);
      }
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Terjadi kesalahan";

      toast.error("Gagal membuat link", message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Main Form Card */}
      <Card className="border border-gray-200 shadow-sm hover:shadow-md transition-shadow bg-white">
        <CardHeader>
          <CardTitle>Buat Link Pendek</CardTitle>
          <CardDescription>
            Masukkan URL panjang yang ingin dipendekkan
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* URL Input */}
            <div>
              <label className="text-sm font-medium text-gray-700 mb-2 block">
                URL yang ingin dipendekkan
              </label>
              <Input
                type="url"
                placeholder="https://example.com/very/long/url"
                value={originalUrl}
                onChange={(e) => setOriginalUrl(e.target.value)}
                className="text-base"
                required
              />
            </div>

            {/* Custom Code Input */}
            <div>
              <label className="text-sm font-medium text-gray-700 mb-2 block">
                Kode custom (opsional)
              </label>
              <Input
                type="text"
                placeholder="misal: github"
                value={customCode}
                onChange={(e) => handleCustomCodeChange(e.target.value)}
                maxLength={16}
                className="text-base"
              />
              {customCode && (
                <p
                  className={`text-sm mt-2 ${
                    codeAvailability.checking
                      ? "text-gray-500"
                      : codeAvailability.available
                      ? "text-green-600"
                      : "text-red-600"
                  }`}
                >
                  {codeAvailability.checking && "🔍 Checking..."}
                  {codeAvailability.available === true &&
                    "✅ " + codeAvailability.message}
                  {codeAvailability.available === false &&
                    "❌ " + codeAvailability.message}
                </p>
              )}
              <p className="text-xs text-gray-500 mt-1">
                Kosongkan untuk generate otomatis
              </p>
            </div>

            {/* Submit Button */}
            <Button
              type="submit"
              className="w-full"
              size="lg"
              // disabled={
              //   isLoading || (customCode !== "" && !codeAvailability.available)
              // }
            >
              {isLoading ? (
                <>
                  <span className="animate-spin mr-2">⏳</span>
                  Memproses...
                </>
              ) : (
                <>
                  <span className="mr-2">✨</span>
                  Pendekkan URL
                </>
              )}
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* Result Card */}
      {result && (
        <Card className="border border-green-200 shadow-sm bg-green-50/50">
          <CardHeader>
            <CardTitle className="text-green-900">
              ✅ Link Pendek Berhasil Dibuat!
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Short URL */}
            <div>
              <label className="text-sm font-medium text-gray-700 mb-2 block">
                Link Pendek Kamu:
              </label>
              <div className="flex gap-2">
                <Input
                  value={`${window.location.origin}/${result.short_code}`}
                  readOnly
                  className="font-mono bg-white"
                />
                <CopyButton
                  text={`${window.location.origin}/${result.short_code}`}
                />
              </div>
            </div>

            {/* Original URL */}
            <div>
              <label className="text-sm font-medium text-gray-700 mb-2 block">
                URL Asli:
              </label>
              <p className="text-sm text-gray-600 break-all bg-white p-3 rounded border">
                {result.original_url}
              </p>
            </div>

            {/* Actions */}
            <div className="flex gap-2">
              <Button
                variant="outline"
                onClick={() => window.open(`/${result.short_code}`, "_blank")}
                className="flex-1"
              >
                🔗 Test Link
              </Button>
              <Button
                variant="outline"
                onClick={() => setResult(null)}
                className="flex-1"
              >
                ➕ Buat Lagi
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
