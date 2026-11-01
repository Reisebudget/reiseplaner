Add-Type -AssemblyName System.Drawing

function New-AppIcon {
  param([int]$size, [string]$path, [bool]$opaque)

  $bmp = New-Object System.Drawing.Bitmap($size, $size)
  $g = [System.Drawing.Graphics]::FromImage($bmp)
  $g.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::AntiAlias
  $g.PixelOffsetMode = [System.Drawing.Drawing2D.PixelOffsetMode]::HighQuality

  $colorTop = [System.Drawing.Color]::FromArgb(255, 37, 99, 235)
  $colorBottom = [System.Drawing.Color]::FromArgb(255, 13, 148, 136)
  $rect = New-Object System.Drawing.Rectangle(0, 0, $size, $size)
  $brush = New-Object System.Drawing.Drawing2D.LinearGradientBrush($rect, $colorTop, $colorBottom, 55)
  $g.FillRectangle($brush, $rect)

  $white = [System.Drawing.Color]::FromArgb(235, 255, 255, 255)
  $whiteBrush = New-Object System.Drawing.SolidBrush($white)
  $pen = New-Object System.Drawing.Pen($white, [Math]::Max(1, $size * 0.018))
  $pen.StartCap = [System.Drawing.Drawing2D.LineCap]::Round
  $pen.EndCap = [System.Drawing.Drawing2D.LineCap]::Round

  $cx = $size * 0.5
  $cy = $size * 0.47
  $r = $size * 0.30
  $g.DrawEllipse($pen, [float]($cx - $r), [float]($cy - $r), [float]($r * 2), [float]($r * 2))

  $rEllipse = New-Object System.Drawing.RectangleF([float]($cx - $r * 0.52), [float]($cy - $r), [float]($r * 1.04), [float]($r * 2))
  $g.DrawEllipse($pen, $rEllipse)

  $y1 = $cy
  $g.DrawLine($pen, [float]($cx - $r), [float]$y1, [float]($cx + $r), [float]$y1)

  $pinW = $size * 0.16
  $pinH = $size * 0.30
  $pinX = $cx
  $pinTopY = $cy + $r * 0.18
  $points = @(
    (New-Object System.Drawing.PointF([float]($pinX - $pinW/2), [float]$pinTopY)),
    (New-Object System.Drawing.PointF([float]($pinX + $pinW/2), [float]$pinTopY)),
    (New-Object System.Drawing.PointF([float]$pinX, [float]($pinTopY + $pinH)))
  )
  $shadowBrush = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(255, 13, 148, 136))
  $g.FillPolygon($whiteBrush, $points)

  $holeR = $pinW * 0.34
  $g.FillEllipse((New-Object System.Drawing.SolidBrush($colorBottom)), [float]($pinX - $holeR), [float]($pinTopY + $pinH*0.28 - $holeR), [float]($holeR*2), [float]($holeR*2))

  if (-not $opaque) {
    # maskable: identisches Motiv, voller Rand bleibt gefüllt (kein zusätzlicher Schnitt nötig, Hintergrund ist bereits randlos)
  }

  $bmp.Save($path, [System.Drawing.Imaging.ImageFormat]::Png)
  $g.Dispose()
  $bmp.Dispose()
}

$dir = Split-Path -Parent $MyInvocation.MyCommand.Path
New-AppIcon -size 192 -path (Join-Path $dir 'icon-192.png') -opaque $true
New-AppIcon -size 512 -path (Join-Path $dir 'icon-512.png') -opaque $true
New-AppIcon -size 512 -path (Join-Path $dir 'icon-512-maskable.png') -opaque $false
New-AppIcon -size 180 -path (Join-Path $dir 'apple-touch-icon.png') -opaque $true
Write-Output "Icons erstellt."
