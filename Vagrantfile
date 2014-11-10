# -*- mode: ruby -*-
# vi: set ft=ruby :

# Vagrantfile API/syntax version. Don't touch unless you know what you're doing!
VAGRANTFILE_API_VERSION = "2"

Vagrant.configure(VAGRANTFILE_API_VERSION) do |config|
  config.vm.define "crowi"

  config.vm.box = "yungsang/boot2docker"

  config.vm.synced_folder ".", "/vagrant"

  config.vm.network :forwarded_port, guest: 28017, host: 28017
  config.vm.network :forwarded_port, guest: 27017, host: 27017
  config.vm.network :forwarded_port, guest: 3000, host: 3000

  config.vm.provision :docker do |d|
    d.build_image "/vagrant/", args: "--rm -t yungsang/crowi"
    d.run "mongodb",
      image: "dockerfile/mongodb",
      args: "-p 27017:27017 -p 28017:28017 --restart=always",
      cmd: "mongod --rest --httpinterface"
    d.run "crowi",
      image: "yungsang/crowi",
      args: "--link mongodb:mongodb -p 3000:3000 -e PASSWORD_SEED=somesecretstring -e MONGOHQ_URL=mongodb://mongodb/crowi --restart=always"
  end
end
