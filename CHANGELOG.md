# v2.1.2

- Updates filtering UI

# v2.1.1

- Adds compatibility with Splice Junction Quantification files from the GDC

# v2.1.0

- Moves the widget to the 'Tools' menu with a new label 'GDC Data Import' and new icon
- Incorporates authentication into GDC, controlled resources are now available to fetch and render
- Adds new extension point logic to GDC adapters

# v2.0.0

- Adds new 'Add GDC Data' widget to the File menu which enables use of GDC files and resources
- Adds adaptability for all GDC-originating data/files that have location information through the Add GDC Data widget
- Adds drag and drop interface for local files that have originated from the GDC
- Adds ability to bulk-import files from the GDC using JSON export
- Adds ability to copy and paste 'Explore' sessions/URLs from the GDC and import them into JBrowse (i.e. `https://portal.gdc.cancer.gov/exploration`)
- Adds ability to copy and paste file URLs from the GDC and import the file into JBrowse (i.e. `https://portal.gdc.cancer.gov/files/<some file UUID>`)
- Adds ability to quick-add GDC explore tracks to maintain multiple sessions of Exploring GDC mutations and genes using the built-in track filtering interface

# v1.0.5

- Update distconfig for demo

# v1.0.4

- Fix import for feature details in sidepanel
- Update to use jexl callback style

# v1.0.3

- Add abortable-promise-cache layer for the graphql API

# v1.0.2

- Fix asset loading from config demo

# v1.0.1

- Release to npm for use with unpkg cdn and custom installations in embedded viewer

# v1.0.0

- Initial release with grahql querying of API, custom track type, custom drawer widget, and more (@agduncan94)
