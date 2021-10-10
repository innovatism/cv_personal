# cv-tools

A set of gulp tasks to manage, package, and share LaTeX documents.

## What is this?

I created this set of gulp tasks to help me manage my CV. I write my CV in
LaTeX and publish it on S3 via a password protected zip archive.

I thought this workflow might be helpful to someone else, so I open sourced the
tool.

Note that the tool will also work with any LaTeX document that you might want
to make publicly available and password protected.

For some context about why I wrote this tool and how I'm using it, check out
this article on Medium:
https://medium.com/@coaxial/how-i-manage-my-cv-with-latex-gulp-s3-and-bitly-99694c01dd8

## Assumptions

- Your document is written using LaTeX
- You want a publicly accessible, passworded protected version of your document
- You want this publicly accessible version to be hosted on S3
- You have a working `npm` and `node` (v16+) install
- You have installed the `texlive-latex-extra` package (or equivalent)

## Configuration

The tool uses two configuration files: `config.json` and `aws_config.json`. I
suggest you use the example files `config.example.json` +
`aws_config.example.json` as templates. When you're done, save a copy and
remove `.example` from the filenames.

### `config.json`

Configuration options for the tool itself

| Option             | Usage                                                              |
| ------------------ | ------------------------------------------------------------------ |
| `resume_filename`  | The LaTeX filename for your resume within `src_dir` (see below)    |
| `archive_filename` | Name used for the resulting compressed, password protected archive |
| `dist_dir`         | Relative path to the directory where the archive will be saved to  |
| `src_dir`          | Relative path to the directory where your LaTeX files live         |

> If you're not using the default for `src_dir`, remember to add it to your
> `.gitignore`

### `aws_config.json`

Contains AWS specific configuration options

| Option   | Usage                                           |
| ---------| ----------------------------------------------- |
| `key`    | Your AWS key                                    |
| `secret` | Your AWS secret                                 |
| `bucket` | Name for the S3 bucket to upload the archive to |
| `region` | Which AWS region to save your archive in (cf.  https://docs.aws.amazon.com/general/latest/gr/rande.html#s3_region)       |

If you are unfamiliar with S3, AWS' documentation is a good starting point:
https://aws.amazon.com/documentation/s3/

## CV files

The tool expects your LaTeX files to be located in the `src_dir` specified in
`config.json`. You can also add any custom LaTeX document class files needed to
build your document in this directory, `pdflatex` will look for them there.

To illustrate, here is what my `src_dir` directory looks like:

```
src/
├── coaxialcv.cls
├── coaxial.pdf
└── coaxial.tex
```

If you version control your LaTeX files, you can git clone your repo in
`src_dir` with `$ git clone user/repo src/`. You'll then be able to work on
your document from within the tool's repo while committing changes to the
documents repo.

## Usage

| Gulp task | Usage |
| --- | --- |
| `work` | Gulp will watch for changes in `src_dir` and recompile to PDF.   |
| `publish` | Will package, password protect, and upload the document to S3 |

> While using the `work` task, I suggest opening the PDF file in a PDF viewer
> on half of your monitor, and your text editor on the other half. As you save
> your document in the text editor, the PDF view will update almost instantly,
> and you'll see the changes right away without switching windows.

There are a few other plumbing tasks that the porcelain tasks above depend on.
All of them are located in `tasks/`, I modularized to help with maintenance and
readability. This is where to look if you're curious about how the tool works
under the hood.


## Contributions

Yes please! Fork the repo, make your changes, update the README if needed, and
make a pull request. Make sure your tests pass against Node v4 and Node v6
both; make sure you use modularization when appropriate, ES6, and promises.

## Issues

If the `work` task fails to run, check that the underlying bash script is working
properly by running it manually: `./lib/pdf_all.sh`.

If you have a question or an issue using the tool, open a GitHub issue for
help.


## License

MIT (c) Coaxial 2016
