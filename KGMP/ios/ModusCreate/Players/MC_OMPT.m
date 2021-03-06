//
//  MC_MP.m
//  TicTacToe
//
//  Created by Jesus Garcia on 4/13/15.
//  Copyright (c) 2015 Facebook. All rights reserved.
//

#import "MC_OMPT.h"
#define PLAYBACK_FREQ 44100

@implementation MC_OMPT {
    
}

int x = 0;

- (void) unloadFile {
    if (self.mod) {
        openmpt_module_destroy(self.mod);
        self.mod = nil;
    }
}


- (NSDictionary *) loadFile:(NSString *)path {
    [self unloadFile];
    
    char *loadedFileData;
   
//    printf("Loading file\n%s\n", [path UTF8String]);
    FILE *file = fopen([path cStringUsingEncoding:NSASCIIStringEncoding], "rb");
    
    if (file == NULL) {
        return NULL;
    }
    
    fseek(file, 0L, SEEK_END);
    long loadedFileSize = ftell(file);
    rewind(file);
    loadedFileData = (char*) malloc(loadedFileSize);
    
    fread(loadedFileData, loadedFileSize, sizeof(char), file);
    
   	openmpt_module * mod = 0;
    mod = openmpt_module_create_from_memory(loadedFileData, loadedFileSize, NULL, NULL, NULL);
  
    fclose(file);
    free(loadedFileData);
    
    if (! mod) {
        return nil;
    }
    
    openmpt_module_set_repeat_count(mod, 100);
    
    self.mod = mod;

    return [self extractInfoFromModFile:mod withPath:path];
}

- (int32_t *) fillBuffer:(AudioQueueBuffer *)mBuffer {

    size_t numFrames =  mBuffer->mAudioDataByteSize / (2 * sizeof(int16_t));
    openmpt_module * mod = self.mod;
    
    printf("numFrames = %zu\n", numFrames);
    
    openmpt_module_read_interleaved_stereo(mod, PLAYBACK_FREQ, numFrames,  mBuffer->mAudioData);
    
    static int32_t data[4];
    
    data[0] = openmpt_module_get_current_order(mod);
    data[1] = openmpt_module_get_current_pattern(mod);
    data[2] = openmpt_module_get_current_row(mod);
    data[3] = openmpt_module_get_pattern_num_rows(mod, data[1]);
    
    return data;
    
}




- (int32_t *) fillBufferFloat:(float *)buffer withNumFrames:(size_t)numFrames {

    openmpt_module * mod = self.mod;
    
//    openmpt_module_read_float_mono(mod, PLAYBACK_FREQ, numFrames *2 , buffer);
    openmpt_module_read_interleaved_float_stereo(mod, PLAYBACK_FREQ , numFrames, buffer);
    
    static int32_t data[4];
    
    data[0] = openmpt_module_get_current_order(mod);
    data[1] = openmpt_module_get_current_pattern(mod);
    data[2] = openmpt_module_get_current_row(mod);
    data[3] = openmpt_module_get_pattern_num_rows(mod, data[1]);

    return data;
}





- (int32_t *) fillLeftBuffer:(float *)leftBuffer withRightBuffer:(float *)rightBuffer withNumFrames:(size_t)numFrames {

    openmpt_module * mod = self.mod;
    
    openmpt_module_read_float_stereo(mod, PLAYBACK_FREQ, numFrames, leftBuffer, rightBuffer);
    
    static int32_t data[4];
    
    data[0] = openmpt_module_get_current_order(mod);
    data[1] = openmpt_module_get_current_pattern(mod);
    data[2] = openmpt_module_get_current_row(mod);
    data[3] = openmpt_module_get_pattern_num_rows(mod, data[1]);
//    printf("Order# %i :: Pattern# %i :: Row# %i\n", data[0], data[1], data[2]);

    return data;
}


- (int) getCurrentOrder {
    return openmpt_module_get_current_order(self.mod);
}

- (int) getCurrentPattern {
    return openmpt_module_get_current_pattern(self.mod);
}

- (int) getCurrentRowNumber {
    return openmpt_module_get_current_row(self.mod);
}

- (void) setNewOrder:(NSNumber *)newOrder {
    int order = [newOrder intValue];
    openmpt_module_set_position_order_row(self.mod, order, 0);
}


- (NSDictionary *) extractInfoFromModFile:(openmpt_module*)myLoadedMpFile withPath:(NSString *)path {
    
    int numPatterns = openmpt_module_get_num_patterns(myLoadedMpFile),
        numChannels = openmpt_module_get_num_channels(myLoadedMpFile),
        numSamples  = openmpt_module_get_num_samples(myLoadedMpFile),
        numInstr    = openmpt_module_get_num_instruments(myLoadedMpFile),
        speed       = openmpt_module_get_current_speed(myLoadedMpFile),
        bpm         = openmpt_module_get_current_tempo(myLoadedMpFile),
        length      = openmpt_module_get_duration_seconds(myLoadedMpFile),
        currentPat  = openmpt_module_get_current_pattern(myLoadedMpFile),
        numOrders   = openmpt_module_get_num_orders(myLoadedMpFile);
    
    
     //type;type_long;container;container_long;tracker;artist;title;date;message;warnings
    
    const char *artist    = openmpt_module_get_metadata(myLoadedMpFile, "artist"),
               *type      = openmpt_module_get_metadata(myLoadedMpFile, "type"),
               *typeLong  = openmpt_module_get_metadata(myLoadedMpFile, "type_long"),
               *tracker   = openmpt_module_get_metadata(myLoadedMpFile, "tracker"),
               *title     = openmpt_module_get_metadata(myLoadedMpFile, "title"),
               *date      = openmpt_module_get_metadata(myLoadedMpFile, "date"),
               *message   = openmpt_module_get_metadata(myLoadedMpFile, "message"),
               *warnings  = openmpt_module_get_metadata(myLoadedMpFile, "warnings"),
               *container = openmpt_module_get_metadata(myLoadedMpFile, "container_long");
    
    NSDictionary *patternsDict = [self getPatterns:myLoadedMpFile];
    
    NSMutableArray *instrumentNames = [[NSMutableArray alloc] init];
    NSString *instName;
    for (int i = 0; i < numInstr; i ++) {
        instName = [[NSString alloc] initWithCString:openmpt_module_get_instrument_name(myLoadedMpFile, i) encoding:NSUTF8StringEncoding];
        [instrumentNames addObject:instName];
        
//        printf("Instrument %i, %s\n", i, openmpt_module_get_instrument_name(myLoadedMpFile, i));
    }
    
    
    NSString *nsName     = [[NSString alloc] initWithCString:title],
             *nsMsg      = [[NSString alloc] initWithCString:message],
             *nsArtist   = [[NSString alloc] initWithCString:artist],
             *nsTypeLong = [[NSString alloc] initWithCString:typeLong],
             *nsType     = [[NSString alloc] initWithCString:type],
             *nsTracker  = [[NSString alloc] initWithCString:tracker],
             *nsDate     = [[NSString alloc] initWithCString:date],
             *nsWarnings = [[NSString alloc] initWithCString:warnings];
    
    // Get nice file Name (Remove the Author group name)
    NSArray *pathSplit = [path componentsSeparatedByString:@"/"];
    
    NSString *fileName    = [pathSplit objectAtIndex:[pathSplit count] -1];
    
    NSArray *fileNameSplit = [fileName componentsSeparatedByString:@" - "];
    
    NSString *file_name = [fileNameSplit objectAtIndex:[fileNameSplit count] - 1],
             *group     = [fileNameSplit objectAtIndex:0];
    
    
    NSMutableArray *patternOrders = [[NSMutableArray alloc] init];
    
    for (int i=0; i < numOrders; i++) {
        int orderPattern   = openmpt_module_get_order_pattern(myLoadedMpFile, i);
        [patternOrders addObject:[[NSNumber alloc] initWithInt:orderPattern]];
    }
    
//    NSDictionary *patternsDict = [self getPatterns:myLoadedMpFile];
    
    return @{
        @"name"        : nsName ?: @"",
        @"message"     : nsMsg  ?: @"",
        @"type"        : nsType ?: @"",
        @"group"       : group,
        
        @"artist"      : nsArtist,
        @"typeLong"    : nsTypeLong,
        @"date"        : nsDate,
        @"warnings"    : nsWarnings,
        @"tracker"     : nsTracker,
        
        @"currentPat"  : [[NSNumber alloc] initWithInt:currentPat],
        @"numPatterns" : [[NSNumber alloc] initWithInt:numPatterns],
        @"tracks"      : [[NSNumber alloc] initWithInt:numChannels],
        @"numInstr"    : [[NSNumber alloc] initWithInt:numInstr],
        @"samples"     : [[NSNumber alloc] initWithInt:numSamples],
        @"speed"       : [[NSNumber alloc] initWithInt:speed],
        @"bpm"         : [[NSNumber alloc] initWithInt:bpm],
        @"length"      : [[NSNumber alloc] initWithInt:length],
        @"patternOrds" : patternOrders,
        @"patterns"    : patternsDict,
        @"file_name"   : file_name,
        @"instruments" : instrumentNames
    };

}


- (NSDictionary *)getInfo:(NSString *)path {
    
    FILE *file =  fopen([path cStringUsingEncoding:NSASCIIStringEncoding], "rb");
    
    if (file == NULL) {
        return nil;
    }
    
    fseek(file, 0L, SEEK_END);
    long loadedFileSize = ftell(file);
    
    rewind(file);
    char * loadedFileData = (char*) malloc(loadedFileSize);
    
    fread(loadedFileData, loadedFileSize, sizeof(char), file);
    
   	openmpt_module * myLoadedMpFile = 0;
	myLoadedMpFile = openmpt_module_create_from_memory(loadedFileData, loadedFileSize, NULL, NULL, NULL);
    
    free(loadedFileData);
    fclose(file);
    
    if (!myLoadedMpFile) {
        return nil;
    }
    
    NSDictionary *retObj = [self extractInfoFromModFile:myLoadedMpFile withPath:path];

    openmpt_module_destroy(myLoadedMpFile);

    return retObj;
}

- (NSDictionary *)getAllPatterns:(NSString *)path {
     FILE *file =  fopen([path cStringUsingEncoding:NSASCIIStringEncoding], "rb");
    
    if (file == NULL) {
        return nil;
    }
    
    fseek(file, 0L, SEEK_END);
    long loadedFileSize = ftell(file);
    
    rewind(file);
    char * loadedFileData = (char*) malloc(loadedFileSize);
    
    fread(loadedFileData, loadedFileSize, sizeof(char), file);
    
   	openmpt_module * myLoadedMpFile = 0;
	myLoadedMpFile = openmpt_module_create_from_memory(loadedFileData, loadedFileSize, NULL, NULL, NULL);
    
    fclose(file);
    
    if (!myLoadedMpFile) {
        return nil;
    }
    
    NSDictionary *retObj = [self getPatterns:myLoadedMpFile];

    openmpt_module_destroy(myLoadedMpFile);
    free(loadedFileData);

    return retObj;
}



- (NSMutableDictionary *) getPatterns:(openmpt_module *)modFile {
    NSMutableDictionary *data = [[NSMutableDictionary alloc] init];
    
    int numOrders   = openmpt_module_get_num_orders(modFile),
        numChannels = openmpt_module_get_num_channels(modFile),
        orderNum    = 0,
        chanWidth   = 13,
        orderPattern,
        patternNumRows;
    
    
    for (; orderNum < numOrders; orderNum++) {
        orderPattern   = openmpt_module_get_order_pattern(modFile, orderNum);
        patternNumRows = openmpt_module_get_pattern_num_rows(modFile, orderPattern);
           
        NSString *patternNumber = [NSString  stringWithFormat:@"%i", orderPattern];
        
        // We've already got this pattern in Memory. So, let's just skip it.
        NSMutableArray *alreadyGotPattern = [data valueForKey:patternNumber] ;
        
        if (patternNumRows > 0 && alreadyGotPattern == nil) {
//            printf("Order# %i :: Pattern# %i :: numRows# %i\n", orderNum, orderPattern, patternNumRows);
           
            NSMutableArray *patternRows = [[NSMutableArray alloc] init];
//            NSString *lessThanSixteen = @"0%X|",
//                     *moreThanSixteen = @"%X|";
           
            for (int rowNumber = 0; rowNumber < patternNumRows; rowNumber++) {
                NSString *rowNsString = @"";
                
                
                for (int chanNumber = 0; chanNumber < numChannels; chanNumber++) {
                    const char * rowInfo = openmpt_module_format_pattern_row_channel(modFile, orderPattern, rowNumber, chanNumber, chanWidth, 1);
                    
                    rowNsString = [rowNsString stringByAppendingString:[NSString stringWithCString:rowInfo]];
                    
                    if (chanNumber < numChannels - 1) {
                        rowNsString = [rowNsString stringByAppendingString:@"|"];
                    }
                
                }
          
              [patternRows addObject:rowNsString];
                
            }
           
            [data setValue:patternRows forKey:patternNumber];
           
        }
        
    
    }
    
    
    return data;
}


- (NSArray *) getPatternData:(NSNumber *)patternNumber {

    openmpt_module *modFile = self.mod;
    
    
    int numChannels = openmpt_module_get_num_channels(modFile),
        orderNum  = 0,
        chanWidth   = 13,
        orderPattern,
        patternNumRows;
    
    
    NSMutableArray *patternRows = [[NSMutableArray alloc] init];


    orderPattern   = openmpt_module_get_order_pattern(modFile, orderNum);
    patternNumRows = openmpt_module_get_pattern_num_rows(modFile, [patternNumber intValue]);
       
    // We've already got this pattern in Memory. So, let's just skip it.

    for (int rowNumber = 0; rowNumber < patternNumRows; rowNumber++) {
        NSString *rowNsString = @"";
        
        for (int chanNumber = 0; chanNumber < numChannels; chanNumber++) {
            const char * rowInfo = openmpt_module_format_pattern_row_channel(modFile, orderPattern, rowNumber, chanNumber, chanWidth, 1);
            
            rowNsString = [rowNsString stringByAppendingString:[NSString stringWithCString:rowInfo]];
            
            if (chanNumber < numChannels - 1) {
                rowNsString = [rowNsString stringByAppendingString:@"|"];
            }
        
        }
  
        [patternRows addObject:rowNsString];
        
    }
   
        
    
    
    return patternRows;


}


@end
