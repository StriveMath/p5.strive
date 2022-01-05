import os
import shutil


def concat(files):
  package = ''
  for fn in files:
    path = os.path.join(os.getcwd(), fn)
    with open(path) as f:
      for line in f:
        package += line
    package += '\n'
  return package


def write(package, filename):
  with open(filename, 'w') as f:
    f.write(package)


def copy_map(filename):
  src = os.path.join(os.getcwd(), 'lib', filename)
  dst = os.path.join(os.getcwd(), 'dist', filename)
  shutil.copy(src, dst)


if __name__ == '__main__':
  files = [
    'lib/p5.js',
    'lib/p5.sound.min.js',
    'lib/math.js',
    'src/p5.strive.js',
    'lib/skulpt.min.js',
    'lib/skulpt-stdlib.js',
    'lib/jquery-3.5.1.min.js',
    'lib/skulptSetup.js'
  ]
  package = concat(files)
  filename = os.path.join(os.getcwd(), 'dist', 'strive.js')
  write(package, filename)
  copy_map('p5.sound.min.js.map')
  copy_map('skulpt.min.js.map')