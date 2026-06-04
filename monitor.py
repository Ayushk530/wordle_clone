import os
import sys
import json
import datetime
import shutil

def check_deployment(deploy_dir):
    report = {
        "timestamp": datetime.datetime.now().isoformat(),
        "status": "HEALTHY",
        "checks": {},
        "system_metrics": {}
    }

    # Files to check in deployment directory
    required_files = [
        "frontend.exe",
        "Wordle_2021_Icon.ico",
        "dictionary_of_words.json",
        "geometry.csv",
        "games_won.txt"
    ]
    
    # Word list file patterns to check
    for difficulty in ["easy", "medium", "hard"]:
        for length in [4, 5, 6, 7]:
            required_files.append(f"{difficulty}_{length}letter words.txt")

    healthy = True
    missing_files = []

    for file_name in required_files:
        full_path = os.path.join(deploy_dir, file_name)
        exists = os.path.exists(full_path)
        size = os.path.getsize(full_path) if exists else 0
        report["checks"][file_name] = {
            "exists": exists,
            "size_bytes": size
        }
        if not exists:
            # We don't mark games_won.txt as a critical failure because it will be created if not exists
            if file_name != "games_won.txt":
                healthy = False
                missing_files.append(file_name)

    # Collect System Metrics
    # Disk Usage
    try:
        total, used, free = shutil.disk_usage(deploy_dir)
        report["system_metrics"]["disk_usage"] = {
            "total_gb": round(total / (1024**3), 2),
            "used_gb": round(used / (1024**3), 2),
            "free_gb": round(free / (1024**3), 2),
            "percent_free": round((free / total) * 100, 2)
        }
    except Exception as e:
        report["system_metrics"]["disk_usage_error"] = str(e)

    # Check if we can import psutil for CPU/Memory, otherwise use fallback
    try:
        import psutil
        report["system_metrics"]["cpu_percent"] = psutil.cpu_percent(interval=0.1)
        report["system_metrics"]["memory"] = {
            "percent_used": psutil.virtual_memory().percent,
            "free_mb": round(psutil.virtual_memory().available / (1024**2), 2)
        }
    except ImportError:
        # Fallback without psutil
        report["system_metrics"]["cpu_percent"] = "psutil not installed"
        report["system_metrics"]["memory"] = "psutil not installed"

    if not healthy:
        report["status"] = "UNHEALTHY"
        report["error_details"] = f"Missing critical files: {', '.join(missing_files)}"
    
    # Save the monitoring report
    report_path = os.path.join(deploy_dir, "monitoring_report.json")
    with open(report_path, "w") as rf:
        json.dump(report, rf, indent=4)
        
    print(f"Monitoring report generated at: {report_path}")
    print(f"Deployment status: {report['status']}")
    
    return healthy

if __name__ == "__main__":
    # Expect deployment directory as the first argument, default to C:\WordleAppProduction
    deploy_path = sys.argv[1] if len(sys.argv) > 1 else r"C:\WordleAppProduction"
    
    if not os.path.exists(deploy_path):
        print(f"Error: Deployment directory {deploy_path} does not exist!")
        sys.exit(1)
        
    is_healthy = check_deployment(deploy_path)
    if not is_healthy:
        sys.exit(1)
    else:
        sys.exit(0)
