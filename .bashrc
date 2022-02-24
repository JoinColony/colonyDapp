alias python=python2
alias pip=pip3

# enable GPG signing
export GPG_TTY=$(tty)

if [ ! -f ~/.gnupg/S.gpg-agent ]; then
    eval $( gpg-agent --daemon --options ~/.gnupg/gpg-agent.conf )
fi

export GPG_AGENT_INFO=${HOME}/.gnupg/S.gpg-agent:0:1

# set DISPLAY variable to the IP automatically assigned to WSL2
export DISPLAY=$(cat /etc/resolv.conf | grep nameserver | awk '{print $2; exit;}'):0.0
sudo /etc/init.d/dbus start &> /dev/null
