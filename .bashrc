alias python=python2
alias pip=pip3

# enable GPG signing
export GPG_TTY=$(tty)

if [ ! -f ~/.gnupg/S.gpg-agent ]; then
    eval $( gpg-agent --daemon --options ~/.gnupg/gpg-agent.conf )
fi

export GPG_AGENT_INFO=${HOME}/.gnupg/S.gpg-agent:0:1