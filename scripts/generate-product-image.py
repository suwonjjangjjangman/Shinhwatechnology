#!/usr/bin/env python3
import argparse
import base64
import json
import os
import subprocess
import urllib.error
import urllib.request

PROJECT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
MODEL = "gemini-2.5-flash-image"

PROMPT_TEMPLATE = """You are given two reference images.

Image 1 is a real photograph of the product ({name}). Preserve its exact shape, proportions, material, finish, and any printed labels/connectors as-is.

Image 2 is an example of the target product-photography style used on this company's website.

Task: Re-render the EXACT SAME physical product from Image 1 as a new photorealistic studio product photo that matches the lighting, background, composition, and mood of Image 2: a deep navy-blue gradient background with a soft radial spotlight vignette, dramatic soft studio key light from the upper left, a subtle soft reflection beneath the product, product shown at a three-quarter hero angle floating slightly above the background, sharp focus, high-end industrial catalog photography look. No added text, no watermark, no logo overlays. Output a single clean product shot, no other objects in frame.

Critically important: scale the product down and keep it fully contained within the frame with clear margin on all sides so nothing is cropped, including any printed labels — render any label text exactly as it appears in Image 1, no typos, no missing or extra characters.
"""


def load_env():
    env_path = os.path.join(PROJECT, ".env")
    if not os.path.exists(env_path):
        return
    with open(env_path) as f:
        for line in f:
            line = line.strip()
            if not line or line.startswith("#") or "=" not in line:
                continue
            k, v = line.split("=", 1)
            os.environ.setdefault(k, v)


def encode(path):
    with open(path, "rb") as f:
        return base64.b64encode(f.read()).decode("utf-8")


def mime_for(path):
    return "image/jpeg" if path.lower().endswith((".jpg", ".jpeg")) else "image/png"


def compress(path, max_dim, quality):
    subprocess.run(["sips", "-Z", str(max_dim), path], check=True, capture_output=True)
    subprocess.run(
        ["sips", "-s", "format", "jpeg", "-s", "formatOptions", str(quality), path, "--out", path],
        check=True, capture_output=True,
    )


def generate(api_key, name, photo, style_ref, out_path, aspect, max_dim, quality):
    url = f"https://generativelanguage.googleapis.com/v1beta/models/{MODEL}:generateContent?key={api_key}"
    parts = [
        {"text": PROMPT_TEMPLATE.format(name=name)},
        {"inline_data": {"mime_type": mime_for(photo), "data": encode(photo)}},
        {"inline_data": {"mime_type": mime_for(style_ref), "data": encode(style_ref)}},
    ]
    body = {
        "contents": [{"parts": parts}],
        "generationConfig": {"responseModalities": ["IMAGE"], "imageConfig": {"aspectRatio": aspect}},
    }
    req = urllib.request.Request(
        url, data=json.dumps(body).encode("utf-8"),
        headers={"Content-Type": "application/json"}, method="POST",
    )
    with urllib.request.urlopen(req, timeout=120) as resp:
        result = json.loads(resp.read().decode("utf-8"))

    for part in result["candidates"][0]["content"]["parts"]:
        inline = part.get("inline_data") or part.get("inlineData")
        if inline:
            os.makedirs(os.path.dirname(out_path), exist_ok=True)
            with open(out_path, "wb") as f:
                f.write(base64.b64decode(inline["data"]))
            compress(out_path, max_dim, quality)
            return out_path
    raise RuntimeError(f"No image returned: {json.dumps(result)[:500]}")


if __name__ == "__main__":
    ap = argparse.ArgumentParser(description="Generate a site-styled AI product photo from a real reference photo (nano-banana / Gemini image model).")
    ap.add_argument("--name", required=True, help="Product name/model code shown to the model, e.g. 'SHB5800M200-1 RF Band Pass Filter'")
    ap.add_argument("--photo", required=True, help="Path to the real product photo")
    ap.add_argument("--out", required=True, help="Output path, e.g. assets/RF/bpf-shb5800m200-1.jpg")
    ap.add_argument("--style-ref", default="assets/RF/Duplexer.jpg", help="Existing site image whose look/lighting to match")
    ap.add_argument("--aspect", default="4:3", help="Output aspect ratio, e.g. 4:3, 16:9")
    ap.add_argument("--max-dim", type=int, default=1280, help="Longest edge in px after resize")
    ap.add_argument("--quality", type=int, default=70, help="JPEG quality 0-100")
    args = ap.parse_args()

    load_env()
    api_key = os.environ["GEMINI_API_KEY"]
    result_path = generate(
        api_key, args.name, args.photo,
        os.path.join(PROJECT, args.style_ref) if not os.path.isabs(args.style_ref) else args.style_ref,
        os.path.join(PROJECT, args.out) if not os.path.isabs(args.out) else args.out,
        args.aspect, args.max_dim, args.quality,
    )
    print("saved ->", result_path)
