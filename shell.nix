{ pkgs ? import <nixpkgs> {} }:

pkgs.mkShell {
  nativeBuildInputs = with pkgs; [
    git
  ];

  shellHook = ''
    if [ -f .env ]; then
      export $(grep -v '^#' .env | xargs)
    fi

    if [ -n "$GIT_USER_EMAIL" ]; then
      git config user.email "$GIT_USER_EMAIL"
    fi
  '';
}
