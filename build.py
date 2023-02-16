import os
import shutil


def concat(files):
  package = ''
  for fn in files:
    path = os.path.join(os.getcwd(), fn)
    with open(path, encoding="utf8") as f:
      for line in f:
        package += line
    package += '\n'
  return package


def write(package, filename):
  with open(filename, 'w', encoding="utf8") as f:
    f.write(package)


def copy_lib(filename):
  src = os.path.join(os.getcwd(), 'lib', filename)
  dst = os.path.join(os.getcwd(), 'dist', filename)
  shutil.copy(src, dst)


def copy_src(filename):
  src = os.path.join(os.getcwd(), 'src', filename)
  dst = os.path.join(os.getcwd(), 'dist', filename)
  shutil.copy(src, dst)


if __name__ == '__main__':
  files = [
      # 'lib/p5.js',
      'lib/math.js',
      # 'src/p5.strive.js',
      'lib/skulpt.min.js',
      'lib/skulpt-stdlib.js',
      'lib/jquery-3.5.1.min.js',
      'src/skulptSetup.js'
  ]
  package = concat(files)
  filename = os.path.join(os.getcwd(), 'dist', 'p5skulpt.js')

  if (os.path.exists(filename)):
    os.remove(filename)
  write(package, filename)

  copy_src('p5.strive.js')
  copy_lib('p5js\\p5.min.js')
  copy_lib('p5js\\addons\\p5.sound.min.js')
  # copy_lib('skulpt.min.js.map')
