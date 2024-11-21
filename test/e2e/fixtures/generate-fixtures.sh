#!/usr/bin/env bash


# Data is loaded by the function `loadBlockFixtures` in ./load-block-fixtures.ts
# Example: const data = await readFile(join(__dirname, '/explore/blocks', blockCid), { encoding: null })
save_fixture() {
  local fixture_cid=$1
  shift
  local fixture_path="$1/$fixture_cid"
  echo -e "\$fixture_path: $fixture_path \n"
  npx kubo block get $fixture_cid > $fixture_path
}

# If a user requests to generate all the fixtures for a full path, we need to loop through the path and save each block
handlePath() {
  local path=$1
  shift
  local save_path=$1
  shift

  # while the path contains slashes, we need to find the CID at each part of the path, save the block, and remove the trailing part in the path
  while (( $(echo $path | grep -o '/' | wc -l) > 0 )); do
    echo "Path=$path"
    local cid_for_path_part=$(npx kubo block stat $path | ggrep '^Key:' | awk -F': ' '{print $2}')

    echo "CID=$cid_for_path_part"
    # save the block
    save_fixture $cid_for_path_part $save_path
    # remove the right-most part from the path
    path=$(echo $path | rev | cut -d'/' -f2- | rev)
  done

  echo "Path=$path"
  echo "CID=$path"
  # now get the last CID in the path and save it
  save_fixture $path $save_path
}

# Example call:
# test/e2e/fixtures/generate-fixtures.sh QmSnuWmxptJZdLJpKRarxBMS2Ju2oANVrgbr2xWbie9b2D explore/blocks
# saves passed root_cid block to the passed save_path
# Originally intended for helping save fixtures for e2e explore.test.js so we could test files in offline mode. i.e.
# not making network requests.
main () {
  # if RUNNING='null', kubo daemon is not running
  EXISTING_NODE=$(npx kubo id | jq .Addresses)
  if [ "$EXISTING_NODE" == "null" ]; then
    echo "Kubo daemon is not running. Starting it."
    mkfifo /tmp/kubo_daemon_fifo
    npx kubo daemon >& /tmp/kubo_daemon_fifo &
    # wait for 'Daemon is ready' message
    while read daemon; do
      if [[ $daemon == *"Daemon is ready"* ]]; then
        echo "Daemon is ready"
        break
      fi
    done < /tmp/kubo_daemon_fifo
  fi
  local DIR
  local FILE
  FILE="${BASH_SOURCE[0]:-${(%):-%x}}"
  DIR="$(dirname $FILE)"
  echo -e "\$DIR: $DIR \n"
  local root_cid=$1
  shift
  local save_path="$DIR/explore/blocks"

  # if instead of an individual CID, we get a path, we need to loop through the path and save each block
  if [[ $root_cid == *"/"* ]]; then
    handlePath $root_cid $save_path
  else
    echo -e "\$root_cid: $root_cid \n"
    save_fixture $root_cid $save_path
  fi

  # Children are not needed for now, but you can get them like so:
  # for cid in $(npx kubo ls $root_cid | awk '{ print $1}'); do
  #   echo -e "\$cid: $cid \n"
  #   save_fixture $cid $save_path
  # done

  if [ "$EXISTING_NODE" == "null" ]; then
    echo "Kubo daemon was started by us. Stopping it."
    npx kubo shutdown
    rm /tmp/kubo_daemon_fifo
  fi
}

main $@
