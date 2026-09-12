# Builds numbered contact sheets of Leah's Facebook-page photo library, so every photo has a stable number.
# Numbering = files sorted by numeric file name (the Facebook media id). Rewrites facebook-page-photos-map.csv next to this script.
# Usage (from repo root):  powershell -File .claude\skills\pilates-ads-campaign\media-library\build-sheets.ps1 -Out <scratch dir>
param([string]$Out = "$env:TEMP\fb-sheets")
Add-Type -AssemblyName System.Drawing
$src = Join-Path ([Environment]::GetFolderPath('MyDocuments')) 'מאגר-מדיה-לאה\facebook-page-photos'
New-Item -ItemType Directory -Force $Out | Out-Null
$files = Get-ChildItem -LiteralPath $src -File | Sort-Object { [int64]$_.BaseName }
$map = New-Object System.Collections.Generic.List[string]
$cols = 7; $rows = 6; $cell = 256; $lab = 24; $per = $cols * $rows
$font = New-Object System.Drawing.Font('Arial', 14, [System.Drawing.FontStyle]::Bold)
$sheet = 0
for ($s = 0; $s -lt $files.Count; $s += $per) {
  $sheet++
  $bmp = New-Object System.Drawing.Bitmap ($cols * $cell), ($rows * ($cell + $lab))
  $g = [System.Drawing.Graphics]::FromImage($bmp); $g.Clear([System.Drawing.Color]::White)
  $g.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
  for ($k = 0; $k -lt $per -and ($s + $k) -lt $files.Count; $k++) {
    $f = $files[$s + $k]; $idx = $s + $k + 1
    $map.Add("$idx,$($f.Name)")
    try {
      $img = [System.Drawing.Image]::FromFile($f.FullName)
      $r = [math]::Min(($cell - 4) / $img.Width, ($cell - 4) / $img.Height)
      $w = [int]($img.Width * $r); $h = [int]($img.Height * $r)
      $x = ($k % $cols) * $cell + [int](($cell - $w) / 2); $y = [math]::Floor($k / $cols) * ($cell + $lab) + [int](($cell - $h) / 2)
      $g.DrawImage($img, $x, $y, $w, $h); $img.Dispose()
    } catch {}
    $g.DrawString("$idx", $font, [System.Drawing.Brushes]::Crimson, ($k % $cols) * $cell + 4, [math]::Floor($k / $cols) * ($cell + $lab) + $cell)
  }
  $g.Dispose()
  $bmp.Save(("$Out\sheet{0:D2}.jpg" -f $sheet), [System.Drawing.Imaging.ImageFormat]::Jpeg); $bmp.Dispose()
}
[IO.File]::WriteAllLines((Join-Path $PSScriptRoot 'facebook-page-photos-map.csv'), $map)
"sheets: $sheet   photos: $($files.Count)   map: $(Join-Path $PSScriptRoot 'facebook-page-photos-map.csv')"
