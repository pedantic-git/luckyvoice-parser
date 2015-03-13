require 'nokogiri'
require 'open-uri'
require 'csv'

PREFIX    = 'https://www.luckyvoicekaraoke.com'
FILE      = 'songs.csv'
LAST_PAGE = 411

def parse(doc, csv)
  doc.css('tbody tr').each do |row|
    r_track,r_artist,r_duration = *row.css('td')
    artist   = r_artist.css('a').first.content.strip
    link     = r_artist.css('a').attr('href')
    track    = r_track.css('a').first.content.strip
    duration = r_duration.content.strip

    csv << [artist,track,duration,PREFIX+link]
  end
end

CSV.open(FILE, 'w', :force_quotes => true) do |csv|
  (1..LAST_PAGE).each do |i|
    puts "Page #{i}"
    doc = Nokogiri::HTML(open("#{PREFIX}/sing/songs?page=#{i}"))
    parse(doc, csv)
    sleep 0.2 # to avoid being throttled
  end
end

# CSV can be imported with:
#
#   mongoimport -h 127.0.0.1 --port 3001 -d meteor -c songs --type csv -f artist,track,duration,link < songs.csv
#
# Get prod parameters using:
#
#   meteor mongo --url blah.meteor.com | perl -nE 'm{mongodb://(.*?):(.*?)\@(.*?):(\d+)/(.*)}; say "mongoimport -h $3 -u $1 -p $2 --db $5 --collection songs --type csv -f artist,track,duration,link --file ../songs.csv"'
