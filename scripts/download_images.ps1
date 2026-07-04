# PowerShell script to create images folders and download high-quality fitness photography from Unsplash

$basePath = "d:\Fitness_studio\frontend\public\images"

# 1. Create subdirectories if they do not exist
$folders = @(
    "hero",
    "programs",
    "trainers",
    "blog",
    "gallery",
    "testimonials",
    "memberships",
    "dashboard",
    "classes",
    "about"
)

foreach ($folder in $folders) {
    $dir = Join-Path $basePath $folder
    if (!(Test-Path $dir)) {
        New-Item -ItemType Directory -Force -Path $dir | Out-Null
        Write-Host "Created directory: $dir"
    }
}

# 2. Define image map of URLs and target paths
$images = @{
    "hero/hero-main.jpg" = "https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&w=1200&q=80"
    "about/about-story.jpg" = "https://images.unsplash.com/photo-1571902943202-507ec2618e8f?auto=format&fit=crop&w=800&q=80"
    
    "programs/hiit.jpg" = "https://images.unsplash.com/photo-1517838277536-f5f99be501cd?auto=format&fit=crop&w=800&q=80"
    "programs/yoga.jpg" = "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?auto=format&fit=crop&w=800&q=80"
    "programs/pilates.jpg" = "https://images.unsplash.com/photo-1518611012118-696072aa579a?auto=format&fit=crop&w=800&q=80"
    "programs/strength.jpg" = "https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?auto=format&fit=crop&w=800&q=80"
    
    "trainers/trainer-sarah.jpg" = "https://images.unsplash.com/photo-1548690312-e3b507d8c110?auto=format&fit=crop&w=400&q=80"
    "trainers/trainer-marcus.jpg" = "https://images.unsplash.com/photo-1567013127542-490d757e51fc?auto=format&fit=crop&w=400&q=80"
    "trainers/trainer-elena.jpg" = "https://images.unsplash.com/photo-1518310383802-640c2de311b2?auto=format&fit=crop&w=400&q=80"
    "trainers/trainer-bruce.jpg" = "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80"
    
    "blog/nutrition-blog.jpg" = "https://images.unsplash.com/photo-1490645935967-10de6ba17061?auto=format&fit=crop&w=600&q=80"
    "blog/stretching-blog.jpg" = "https://images.unsplash.com/photo-1566241477600-ac026ad43874?auto=format&fit=crop&w=600&q=80"
    "blog/wellness-blog.jpg" = "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?auto=format&fit=crop&w=600&q=80"
    
    "gallery/gallery-01.jpg" = "https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&w=600&q=80"
    "gallery/gallery-02.jpg" = "https://images.unsplash.com/photo-1517838277536-f5f99be501cd?auto=format&fit=crop&w=600&q=80"
    "gallery/gallery-03.jpg" = "https://images.unsplash.com/photo-1518611012118-696072aa579a?auto=format&fit=crop&w=600&q=80"
    "gallery/gallery-04.jpg" = "https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?auto=format&fit=crop&w=600&q=80"
    
    "memberships/membership-main.jpg" = "https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&w=800&q=80"
    "dashboard/dashboard-lifestyle.jpg" = "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&w=800&q=80"
}

# 3. Download images
$images.GetEnumerator() | ForEach-Object {
    $targetFile = Join-Path $basePath $_.Key
    $url = $_.Value
    
    if (!(Test-Path $targetFile)) {
        Write-Host "Downloading $url to $targetFile..."
        try {
            Invoke-WebRequest -Uri $url -OutFile $targetFile -UserAgent "Mozilla/5.0" | Out-Null
            Write-Host "Success: $_.Key"
        } catch {
            Write-Warning "Failed to download $_.Key : $_"
        }
    } else {
        Write-Host "$($_.Key) already exists."
    }
}
