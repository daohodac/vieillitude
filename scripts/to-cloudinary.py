import cloudinary
import cloudinary.uploader
import cloudinary.api
import sys
import os

dir = sys.argv[1]
year = sys.argv[2]

print "cloudninary vieillitude importer started"

for filename in os.listdir(dir):
    if filename.endswith(".jpg") or filename.endswith(".JPG"):
        img=os.path.join(dir, filename)
        public_id=os.path.splitext(filename)[0]+"-"+year
        print "uploading", public_id
        cloudinary.uploader.unsigned_upload(img, "vieillitude",
             cloud_name = 'daohodac', public_id=public_id)
        continue
    else:
        continue

#
# local=dir+"/Users/dao/Desktop/familly/litetmixe2015/IMG_2862.jpg"
# print "uploading", local
# cloudinary.uploader.unsigned_upload(local, "vieillitude",
#     cloud_name = 'daohodac', public_id="totototo")
