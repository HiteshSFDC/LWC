/**
 * @description       : 
 * @author            : Hitesh Garg
 * @last modified on  : 05-23-2021
 * @last modified by  : Hitesh Garg
 * Modifications Log 
 * Ver   Date         Author        Modification
 * 1.0   05-23-2021   Hitesh Garg   Initial Version
**/
public without sharing class AttachmentsController {
   
    @AuraEnabled
    public static List<ContentVersion> getFiles(String recId){

        if( String.isBlank( recId )){
            return null;
        }   

        List< ContentDocumentLink > conDoclist = [ SELECT ContentDocumentId 
                                                FROM ContentDocumentLink
                                                WHERE LinkedEntityId = :recId];
        if( conDoclist.isEmpty() ){
            return null;
        }   

        List< Id > conDocIdList = new List< Id >();
        for( ContentDocumentLink conDoc : conDoclist ){
            conDocIdList.add( conDoc.ContentDocumentId );
        }   
        
        List< ContentVersion > cvList = [ SELECT Id, ContentDocumentId, ContentUrl, 
                                            VersionNumber, Title, PathOnClient, 
                                            FileType, FileExtension, ContentSize,
                                            CreatedDate  FROM ContentVersion WHERE ContentDocumentId IN :conDocIdList ];        
        return cvList;
    }
}
