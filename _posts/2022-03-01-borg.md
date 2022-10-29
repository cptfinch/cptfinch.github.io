# About Borg Backup

encrypted 

compressed, 

deduplicated 

Works with 

local files, 

remote servers 

Back up to : 

cloud hosts 

# Set up Borg backup on Nixos

as root: 

mkdir borgbackup

cd borgbackup

ssh-keygen -f ssh_key -t ed25519 -C "Borg Backup"

no SSH key password

create an encryption passphrase for the backup repository

nix-shell -p python39Packages.xkcdpass --run 'xkcdpass -n 12' > passphrase

record it in 1password

In the BorgBase UI: 

click on the Account tab 

open the SSH key management window. 

Click on Add Key and paste in the contents of ./ssh_key.pub. 

Click Add Key and 

then go back to the Repositories tab

Click New Repo 

name it after the hostname of the server you are working on. 

Select the key you just created to h

copy the repository path with the copy icon next to your repository in the list. 

Attempt to SSH into the backup repo

ssh -i ./ssh_key o6h6zl22@o6h6zl22.repo.borgbase.com

ssh -i ./ssh_key_borg bh567n2v@bh567n2v.repo.borgbase.com


accept the host key and 
press control-c to terminate

add to configuration.nix file:

```
services.borgbackup.jobs."borgbase" = {
  paths = [
    "/var/lib"
    "/srv"
    "/home"
  ];
  exclude = [
    # very large paths
    "/var/lib/docker"
    "/var/lib/systemd"
    "/var/lib/libvirt"
    
    # temporary files created by cargo and `go build`
    "**/target"
    "/home/*/go/bin"
    "/home/*/go/pkg"
  ];
  repo = "o6h6zl22@o6h6zl22.repo.borgbase.com:repo";
  encryption = {
    mode = "repokey-blake2";
    passCommand =  "cat /root/borgbackup/passphrase";
  };
  environment.BORG_RSH = "ssh -i /home/galactus/id_ed";
#  environment.BORG_RSH = "ssh -i /root/borgbackup/ssh_key";
  compression = "auto,lzma";
  startAt = "daily";
};
```

nixos-rebuild switch

start backup job:

systemctl start borgbackup-job-borgbase.service

Monitor the job with this command:

journalctl -fu borgbackup-job-borgbase.service

new backup snapshots every night at midnight local time.

restore files from when?  

NixOS includes a wrapper script for each Borg job 

mount backup archive: 

mkdir mount

borg-job-borgbase mount o6h6zl22@o6h6zl22.repo.borgbase.com:repo ./mount

look through each folder 

copy out what you need

when finished , unmount:

borg-job-borgbase umount /root/borgbase/mount

copy down the encryption passphrase 


