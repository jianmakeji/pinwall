'use strict';

const Service = require('egg').Service;

class Artifacts extends Service {

  async transferArtifacts() {
    const ctx = this.ctx;
    const client1 = ctx.app.mysql.get('db1');
    const client2 = ctx.app.mysql.get('db2');

    const artifacts = await client1.select("artifacts");

    for (const artifact of artifacts) {
      console.log(artifact.id);
      let data = {
        Id: artifact.id,
        userId:artifact.user_id,
        name: artifact.name,
        description:artifact.description,
        profileImage:artifact.profile_image,
        jobTag:1,
        createAt:artifact.created_at,
        updateAt:artifact.updated_at,
      };

      if (artifact.visible == 't'){
        data.visible = 0;
      }
      else{
        data.visible = 1;
      }

      const resultList1 = await client1.query('select ars.* from artifact_scores ars, users u,user_role ur where ars.scorer_id = u.id and u.id=ur.user_id and artifact_id=? and ur.role_id = 1', [artifact.id]);
      for (const ar of resultList1){
        let likeData = {
          tag:2,
          userId:ar.scorer_id,
          artifactId:ar.artifact_id,
        };
        await client2.insert("artifact_medal_like",likeData);
      }
      const resultCount1 = await client1.query('select count(*)  as count from artifact_scores ars, users u,user_role ur where ars.scorer_id = u.id and u.id=ur.user_id and artifact_id=? and ur.role_id = 1', [artifact.id]);
      data.likeCount = resultCount1[0].count;

      const resultList2 = await client1.query('select ars.* from artifact_scores ars, users u,user_role ur where ars.scorer_id = u.id and u.id=ur.user_id and artifact_id=? and ur.role_id > 1', [artifact.id]);
      for (const ar of resultList2){
        let likeData = {
          tag:1,
          userId:ar.scorer_id,
          artifactId:ar.artifact_id,
        };
        await client2.insert("artifact_medal_like",likeData);
      }

      const resultCount2 = await client1.query('select count(*)  as count from artifact_scores ars, users u,user_role ur where ars.scorer_id = u.id and u.id=ur.user_id and artifact_id=? and ur.role_id > 1', [artifact.id]);

      data.medalCount = resultCount2[0].count;

      const resultList3 =  await client1.query('select acs.* from artifact_comments acs where artifact_id=?',[artifact.id]);
      for (const ar of resultList3){
        let commentData = {
          content:ar.content,
          commenterId:ar.commenter_id,
          artifactId:ar.artifact_id,
          commentAt:ar.commented_at
        };

        if (ar.visible == 't'){
          commentData.visible = 0;
        }
        else{
          commentData.visible = 1;
        }

        await client2.insert("artifact_comments",commentData);
      }

      const resultCount3 = await client1.query('select count(*) as count from artifact_comments acs, users u where acs.commenter_id = u.id and artifact_id=?', [artifact.id]);

      data.commentCount = resultCount3[0].count;
      await client2.insert("artifacts", data);
    }
  }

  async transferArtifactsAssets() {
    const ctx = this.ctx;
    const client1 = ctx.app.mysql.get('db1');
    const client2 = ctx.app.mysql.get('db2');

    const artifact_assets = await client1.query("select * from artifact_assets where artifact_id > 20000 and artifact_id <= 60000 ");
    let i = 0;
    for (const artifact_asset of artifact_assets) {
      console.log(i++);
      let data = {
        artifactId:artifact_asset.artifact_id,
        position:artifact_asset.pos,
        name:artifact_asset.name,
        filename:artifact_asset.filename,
        description:artifact_asset.description,
        profileImage:artifact_asset.profile_image,
        mediaFile:artifact_asset.media_file,
        viewUrl:artifact_asset.view_url,
      };
      if (artifact_asset.type == 128){
        data.type = 2;
      }
      else if (artifact_asset.type == 32 || artifact_asset.type == 256){
        data.type = 3;
      }
      else if (artifact_asset.type == 4){
        data.type = 4;
      }
      else{
        data.type = 1;
      }
      await client2.insert("artifact_assets", data);
    }
  }

  async transferArtifactsTerm() {
    const ctx = this.ctx;
    const client1 = ctx.app.mysql.get('db1');
    const client2 = ctx.app.mysql.get('db2');

    const artifact_terms = await client1.select("artifact_term");

    for (const artifact_term of artifact_terms) {
      let data = {
        artifactId:artifact_term.artifact_id,
        termId:artifact_term.term_id,
      };

      await client2.insert("artifact_term", data);
    }
  }
}

module.exports = Artifacts;
