Open powershell.

Check for WSL updates.

```
wsl --update 
```

List available distros:

```
wsl --list --online
```

Install a new distribution

```
wsl --install --distribution Debian
```

Turn on systemd. 
Edit /etc/wsl.conf file , add these lines

```
[boot]
systemd=true
```

Restart WSL. 

```
wsl.exe --shutdown 
```

Check that systemd is running. Run this command , if it works then systemd is running. 

```
systemctl list-unit-files --type=service 
```

 
WSL store version is only available on Windows 11.

You can try to download release version.






--- 
Systemd provides a system manager 

Systemd provides a service manager 

The systemd process has id of 1. PID = 1

With systemd you can run more applications, such as snap or kubernetes.

systemctl is a program that is part of systemd.

Use systemctl to manage / start stop services. 




# WSL with systemd 

Which services are available? And what is their status?

```
systemctl list-units --type=service 
```

systemd requires PID 1. 

# The WSL init process

The WSL init process is a child process of systemd. 

The WSL init process sets up communication between Linux and Windows components, 

changing this hierarchy required rethinking some of the assumptions made with the WSL init process. 

Additional modifications had to be made to ensure a clean shutdown (as that shutdown is controlled by systemd now) and to have compatibility with WSLg, 

With this change, systemd services will NOT keep your WSL instance alive. 

Your WSL instance will stay alive in the same way it did before, which you can read more about here.
