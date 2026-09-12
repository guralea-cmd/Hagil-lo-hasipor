# TikTok version of an approved post image - format approved by Leah 2026-09-12.
# 1080x1920. The image keeps its full width (1080) and is never cropped, shrunk into a strip, or blurred.
# The space above/below is filled with the image's own edge color (average of its top row / bottom row).
# Usage (from repo root):  powershell -File .claude\skills\pilates-ads-campaign\media-library\make-tiktok.ps1 -In images\pilates\week2 -Out <dir>
param([Parameter(Mandatory)][string]$In, [Parameter(Mandatory)][string]$Out)
Add-Type -AssemblyName System.Drawing
New-Item -ItemType Directory -Force $Out | Out-Null
function AvgRow($bmp, $y) { $r=0;$g=0;$b=0;$n=0; for ($x=0; $x -lt $bmp.Width; $x+=3) { $c=$bmp.GetPixel($x,$y); $r+=$c.R;$g+=$c.G;$b+=$c.B;$n++ }; [System.Drawing.Color]::FromArgb([int]($r/$n),[int]($g/$n),[int]($b/$n)) }
$enc = [System.Drawing.Imaging.ImageCodecInfo]::GetImageEncoders() | Where-Object MimeType -eq 'image/jpeg'
$ep = New-Object System.Drawing.Imaging.EncoderParameters 1; $ep.Param[0] = New-Object System.Drawing.Imaging.EncoderParameter ([System.Drawing.Imaging.Encoder]::Quality), 92L
foreach ($file in Get-ChildItem $In -File -Include *.jpg,*.jpeg,*.png -Recurse) {
  $img = New-Object System.Drawing.Bitmap $file.FullName
  $h = [int][math]::Round($img.Height * 1080 / $img.Width)
  if ($h -gt 1920) { "SKIP $($file.Name): taller than 9:16 at full width - needs a manual decision"; $img.Dispose(); continue }
  $top = AvgRow $img 1; $bot = AvgRow $img ($img.Height - 2)
  $cv = New-Object System.Drawing.Bitmap 1080, 1920
  $g = [System.Drawing.Graphics]::FromImage($cv); $g.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
  $y0 = [int]((1920 - $h) / 2)
  $g.FillRectangle((New-Object System.Drawing.SolidBrush $top), 0, 0, 1080, $y0 + 4)
  $g.FillRectangle((New-Object System.Drawing.SolidBrush $bot), 0, $y0 + $h - 4, 1080, 1920 - ($y0 + $h) + 4)
  $g.DrawImage($img, 0, $y0, 1080, $h); $g.Dispose()
  $cv.Save((Join-Path $Out ($file.BaseName + '.jpg')), $enc, $ep); $cv.Dispose(); $img.Dispose()
  "OK $($file.Name) -> 1080x1920"
}
