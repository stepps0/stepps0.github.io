#import necessary libraries
from bs4 import BeautifulSoup
import urllib2
import optparse

#setting up the option to enter URL via command line
opt_parser = optparse.OptionParser()

#adding the command line option to enter a URL, set default URL
opt_parser.add_option('-e', '--html_entry', dest='html_entry', action='store', default="https://en.wikipedia.org/wiki/HTML", help='find a URL to parse and paste it after -e ')

#finishing option setup
options, args = opt_parser.parse_args()

#assigning the parse response to a variable
response = urllib2.urlopen(options.html_entry)

#reading that response
html = response.read()

#parsing that read
html_file = BeautifulSoup(html, 'html.parser')

#print the html file in text
print(html_file.prettify())
