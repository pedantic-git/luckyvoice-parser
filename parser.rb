require 'nokogiri'
require 'open-uri'
require 'csv'

PREFIX    = 'http://www.luckyvoice.com'
FILE      = 'songs.csv'
LAST_PAGE = 453

def parse(doc, csv)
  doc.css('tbody tr').each do |row|
    r_artist,r_track,r_duration = *row.css('td')
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
    sleep 1 # to avoid being throttled
  end
end
